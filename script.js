// Hamburger menu functionality
const hamburger = document.querySelector(".hamburger")
const navLinks = document.querySelector(".nav-links")

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active")
  hamburger.classList.toggle("active")
})

// Close menu when a link is clicked
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active")
    hamburger.classList.remove("active")
  })
})

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    })
  })
})

// Typewriter effect
const typewriter = document.getElementById("typewriter")
const phrases = ["Computer Engineering Undergraduate", "AI/ML Enthusiast", "Innovator"]
let phraseIndex = 0
let charIndex = 0
let isDeleting = false

function typeEffect() {
  const currentPhrase = phrases[phraseIndex]

  if (isDeleting) {
    typewriter.textContent = currentPhrase.substring(0, charIndex - 1)
    charIndex--
  } else {
    typewriter.textContent = currentPhrase.substring(0, charIndex + 1)
    charIndex++
  }

  if (!isDeleting && charIndex === currentPhrase.length) {
    isDeleting = true
    setTimeout(typeEffect, 2000)
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false
    phraseIndex = (phraseIndex + 1) % phrases.length
    setTimeout(typeEffect, 500)
  } else {
    setTimeout(typeEffect, isDeleting ? 50 : 100)
  }
}

typeEffect()

// Form submission
const form = document.getElementById("contact-form")

form.addEventListener("submit", async (e) => {
  e.preventDefault()

  const formData = new FormData(form)
  const response = await fetch(form.action, {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
    },
  })

  if (response.ok) {
    form.reset()
    alert("Message sent successfully!")
  } else {
    alert("Oops! There was a problem sending your message.")
  }
})

const canvas = document.getElementById("starfield")
const ctx = canvas.getContext("2d")

function resizeCanvas() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

// Initial canvas setup
resizeCanvas()

const stars = []
const numStars = 200

function getGradientColor(opacity) {
  const color1 = [108, 99, 255] // #6C63FF
  const color2 = [0, 245, 160] // #00F5A0
  const ratio = Math.random()

  const r = Math.round(color1[0] * (1 - ratio) + color2[0] * ratio)
  const g = Math.round(color1[1] * (1 - ratio) + color2[1] * ratio)
  const b = Math.round(color1[2] * (1 - ratio) + color2[2] * ratio)

  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

class Star {
  constructor() {
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height
    this.size = Math.random() * 1.5 + 0.5
    this.speedX = (Math.random() - 0.5) * 0.5
    this.speedY = (Math.random() - 0.5) * 0.5
    this.color = getGradientColor(0.8)
  }

  update() {
    this.x += this.speedX
    this.y += this.speedY

    // Bounce off edges with damping
    if (this.x < 0 || this.x > canvas.width) {
      this.speedX *= -0.8
      this.x = this.x < 0 ? 0 : canvas.width
    }
    if (this.y < 0 || this.y > canvas.height) {
      this.speedY *= -0.8
      this.y = this.y < 0 ? 0 : canvas.height
    }

    // Add slight attraction to mouse when nearby
    if (mouse.x && mouse.y) {
      const dx = mouse.x - this.x
      const dy = mouse.y - this.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      if (distance < 200) {
        this.speedX += (dx / distance) * 0.02
        this.speedY += (dy / distance) * 0.02
      }
    }

    // Add some random movement
    this.speedX += (Math.random() - 0.5) * 0.01
    this.speedY += (Math.random() - 0.5) * 0.01

    // Limit speed
    const speed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY)
    if (speed > 2) {
      this.speedX = (this.speedX / speed) * 2
      this.speedY = (this.speedY / speed) * 2
    }
  }

  draw() {
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
  }
}

for (let i = 0; i < numStars; i++) {
  stars.push(new Star())
}

// Mouse interaction
const mouse = {
  x: null,
  y: null,
}

canvas.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX
  mouse.y = e.clientY
})

canvas.addEventListener("mouseleave", () => {
  mouse.x = null
  mouse.y = null
})

function drawLines() {
  ctx.lineWidth = 0.5
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const dx = stars[i].x - stars[j].x
      const dy = stars[i].y - stars[j].y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 150) {
        const opacity = (1 - distance / 150) * 0.5
        ctx.strokeStyle = getGradientColor(opacity)
        ctx.beginPath()
        ctx.moveTo(stars[i].x, stars[i].y)
        ctx.lineTo(stars[j].x, stars[j].y)
        ctx.stroke()
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  stars.forEach((star) => {
    star.update()
    star.draw()
  })
  drawLines()
  requestAnimationFrame(animate)
}

animate()

window.addEventListener("resize", () => {
  resizeCanvas()
  stars.length = 0 // Clear existing stars
  for (let i = 0; i < numStars; i++) {
    stars.push(new Star())
  }
})

const canvas = document.getElementById('stars-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let stars = [];
let mouse = { x: -1000, y: -1000 };

// ضبط حجم الشاشة والتصحيح للشاشات عالية الدقة (DPI)
function resize() {
    const dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    
    initStars();
}

// إنشاء النجوم مع مراعاة أداء الجوال
function initStars() {
    stars = [];
    // تقليل كثافة النجوم على الشاشات الصغيرة لحفظ سلاسة الأداء
    const factor = width < 640 ? 6000 : 3500;
    const count = Math.floor((width * height) / factor);
    
    for (let i = 0; i < count; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 1.5 + 0.5,
            alpha: Math.random() * 0.8 + 0.2,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25
        });
    }
}

// تتبع الماوس أو اللمس للجوال
function updatePointer(e) {
    if (e.touches && e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
    } else {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }
}

window.addEventListener('mousemove', updatePointer);
window.addEventListener('touchmove', updatePointer, { passive: true });

window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
});

window.addEventListener('touchend', () => {
    mouse.x = -1000;
    mouse.y = -1000;
});

// تحريك ورسم النجوم
function animate() {
    ctx.clearRect(0, 0, width, height);

    stars.forEach(star => {
        star.x += star.vx;
        star.y += star.vy;

        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        const dx = mouse.x - star.x;
        const dy = mouse.y - star.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = width < 640 ? 80 : 120;

        let offsetX = 0;
        let offsetY = 0;

        if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance;
            offsetX = -(dx / distance) * force * 12;
            offsetY = -(dy / distance) * force * 12;
        }

        ctx.beginPath();
        ctx.arc(star.x + offsetX, star.y + offsetY, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();
    });

    requestAnimationFrame(animate);
}

window.addEventListener('resize', resize);
resize();
animate();
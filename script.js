// =============================================
// CÁC BIẾN TOÀN CỤC
// =============================================

const THEME_KEY = 'theme_mode';
const btn = document.getElementById('theme-toggle');

// Danh sách hình ảnh cho lightbox
const galleryImages = [
    { src: 'anh21.jpg', caption: 'Hoạt động trải nghiệm' },
    { src: 'anh22.jpg', caption: 'Hoạt động lễ hội' },
    { src: 'anh23.jpg', caption: 'Tập thể tham gia' },
    { src: 'anh24.jpg', caption: 'Giới thiệu di tích' },
    { src: 'anh2.jpg', caption: 'Học sinh trải nghiệm' },
    { src: 'anh3.jpg', caption: 'Cáp treo Yên Tử' },
    { src: 'anh14.jpg', caption: 'Chùa Đồng' },
    { src: 'anh15.jpg', caption: 'Tượng Phật hoàng' }
];

// Biến cho lightbox
let currentImageIndex = 0;

// =============================================
// HÀM KHỞI TẠO
// =============================================

// Hàm khởi tạo tất cả các chức năng
function init() {
    initTheme();
    initScrollEffects();
    initLightbox();
    initNavigation();
    setCurrentYear();
    
    console.log('Website đã được khởi tạo thành công!');
}

// =============================================
// CHỨC NĂNG CHUYỂN ĐỔI THEME
// =============================================

// Kiểm tra hệ thống có đang ở chế độ tối không
function prefersDark() {
    return window.matchMedia('(prefers-color-scheme:dark)').matches;
}

// Áp dụng theme
function applyTheme(mode) {
    document.documentElement.setAttribute('data-theme', 
        mode === 'auto' ? (prefersDark() ? 'dark' : 'light') : mode);
}

// Lấy theme đã lưu
function getSavedTheme() {
    return localStorage.getItem(THEME_KEY) || 'auto';
}

// Khởi tạo chức năng theme
function initTheme() {
    if (!btn) return;
    
    // Áp dụng theme đã lưu
    const savedTheme = getSavedTheme();
    applyTheme(savedTheme);
    updateThemeButton(savedTheme);
    
    // Thêm sự kiện click cho nút theme
    btn.addEventListener('click', toggleTheme);
}

// Chuyển đổi theme
function toggleTheme() {
    const current = getSavedTheme();
    let newTheme;
    
    if (current === 'auto') {
        newTheme = 'light';
    } else if (current === 'light') {
        newTheme = 'dark';
    } else {
        newTheme = 'auto';
    }
    
    localStorage.setItem(THEME_KEY, newTheme);
    applyTheme(newTheme);
    updateThemeButton(newTheme);
}

// Cập nhật biểu tượng nút theme
function updateThemeButton(theme) {
    if (!btn) return;
    
    if (theme === 'dark') {
        btn.textContent = '☀️';
        btn.title = 'Chuyển sang chế độ sáng';
    } else {
        btn.textContent = '🌙';
        btn.title = 'Chuyển sang chế độ tối';
    }
}

// =============================================
// HIỆU ỨNG CUỘN VÀ FADE-IN
// =============================================

// Khởi tạo hiệu ứng cuộn
function initScrollEffects() {
    initFadeInOnScroll();
    initProgressBar();
    initBackToTop();
}

// Hiệu ứng fade-in khi cuộn
function initFadeInOnScroll() {
    const faders = document.querySelectorAll('.fade-in, .content-block');
    const observer = new IntersectionObserver(handleIntersection, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    faders.forEach(fader => observer.observe(fader));
}

// Xử lý sự kiện khi phần tử xuất hiện trong viewport
function handleIntersection(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}

// Thanh tiến trình cuộn
function initProgressBar() {
    const progressBar = document.getElementById('progressBar');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - 
                            document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Nút back to top
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// =============================================
// LIGHTBOX CHO THƯ VIỆN ẢNH
// =============================================

// Khởi tạo lightbox
function initLightbox() {
    // Thêm sự kiện click cho tất cả ảnh trong gallery
    document.querySelectorAll('.gallery img').forEach((img, index) => {
        img.addEventListener('click', () => openLightbox(index));
    });

    // Thêm sự kiện cho các nút điều khiển lightbox
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightbox = document.getElementById('lightbox');

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', showPrevImage);
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', showNextImage);
    }

    // Đóng lightbox khi click bên ngoài ảnh
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Điều hướng bằng bàn phím
    document.addEventListener('keydown', handleKeyboardNavigation);
}

// Mở lightbox
function openLightbox(index) {
    currentImageIndex = index;
    updateLightbox();
    
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Đóng lightbox
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Cập nhật nội dung lightbox
function updateLightbox() {
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    
    if (!lightboxImage || !lightboxCaption) return;
    
    const image = galleryImages[currentImageIndex];
    lightboxImage.src = image.src;
    lightboxImage.alt = image.caption;
    lightboxCaption.textContent = image.caption;
}

// Hiển thị ảnh tiếp theo
function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateLightbox();
}

// Hiển thị ảnh trước đó
function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightbox();
}

// Xử lý điều hướng bằng bàn phím
function handleKeyboardNavigation(e) {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox || !lightbox.classList.contains('active')) return;
    
    switch(e.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowRight':
            showNextImage();
            break;
        case 'ArrowLeft':
            showPrevImage();
            break;
    }
}

// =============================================
// ĐIỀU HƯỚNG VÀ CÁC TIỆN ÍCH KHÁC
// =============================================

// Khởi tạo điều hướng mượt
function initNavigation() {
    // Tạo navigation nếu chưa có
    createNavigation();
    
    // Thêm sự kiện cho các liên kết điều hướng
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', handleNavClick);
    });
}

// Tạo thanh điều hướng
function createNavigation() {
    // Kiểm tra xem đã có nav chưa
    if (document.querySelector('nav')) return;
    
    const nav = document.createElement('nav');
    nav.className = 'glass fade-in';
    
    const navItems = [
        { href: '#gioithieu-truong', text: 'Giới thiệu' },
        { href: '#tongquan', text: 'Tổng quan' },
        { href: '#ditich', text: 'Di tích' },
        { href: '#giatri', text: 'Giá trị' },
        { href: '#giaiphap', text: 'Giải pháp' },
        { href: '#thuvien', text: 'Thư viện' }
    ];
    
    navItems.forEach(item => {
        const link = document.createElement('a');
        link.href = item.href;
        link.textContent = item.text;
        nav.appendChild(link);
    });
    
    // Chèn nav sau header
    const header = document.querySelector('header');
    if (header) {
        header.parentNode.insertBefore(nav, header.nextSibling);
    }
}

// Xử lý click điều hướng
function handleNavClick(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        const offsetTop = targetElement.offsetTop - 20;
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        
        // Thêm hiệu ứng active cho nav item
        setActiveNavItem(this);
    }
}

// Đặt nav item đang active
function setActiveNavItem(activeItem) {
    document.querySelectorAll('nav a').forEach(item => {
        item.classList.remove('active');
    });
    activeItem.classList.add('active');
}

// Cập nhật nav item active khi cuộn
function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && 
            window.scrollY < sectionTop + sectionHeight) {
            currentSection = '#' + section.id;
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentSection) {
            link.classList.add('active');
        }
    });
}

// Đặt năm hiện tại trong footer
function setCurrentYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// =============================================
// TẠO HIỆU ỨNG HẠT PARTICLE
// =============================================

function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    particlesContainer.id = 'particles';
    document.body.prepend(particlesContainer);

    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Thuộc tính ngẫu nhiên
        const size = Math.random() * 5 + 2;
        const left = Math.random() * 100;
        const animationDuration = Math.random() * 20 + 10;
        const animationDelay = Math.random() * 5;
        const opacity = Math.random() * 0.5 + 0.1;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.animationDuration = `${animationDuration}s`;
        particle.style.animationDelay = `${animationDelay}s`;
        particle.style.opacity = opacity;
        
        particlesContainer.appendChild(particle);
    }
}

// =============================================
// XỬ LÝ SỰ KIỆN LOAD VÀ RESIZE
// =============================================

// Xử lý khi trang đã tải xong
document.addEventListener('DOMContentLoaded', () => {
    init();
    createParticles();
});

// Xử lý khi resize window
window.addEventListener('resize', () => {
    // Có thể thêm các xử lý responsive tại đây
});

// Xử lý scroll để cập nhật nav active
window.addEventListener('scroll', () => {
    updateActiveNavOnScroll();
});

// =============================================
// CÁC HÀM TIỆN ÍCH BỔ SUNG
// =============================================

// Hàm tạo hiệu ứng typewriter cho tiêu đề
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Hàm kiểm tra xem phần tử có trong viewport không
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Hàm debounce để tối ưu hiệu suất
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Hàm định dạng số (thêm dấu phẩy)
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// =============================================
// XỬ LÝ LỖI VÀ FALLBACK
// =============================================

// Xử lý lỗi ảnh không tải được
function handleImageError(img) {
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7imqMgU8O1bmggxJHhuqNwIMSR4bqjbiDEkeG6o2k8L3RleHQ+PC9zdmc+';
    img.alt = 'Không thể tải hình ảnh';
}

// Thêm sự kiện error cho tất cả ảnh
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', () => handleImageError(img));
    });
});

// Fallback cho Intersection Observer
if (!('IntersectionObserver' in window)) {
    console.warn('IntersectionObserver không được hỗ trợ, tất cả phần tử sẽ hiển thị ngay lập tức');
    document.querySelectorAll('.fade-in, .content-block').forEach(el => {
        el.classList.add('visible');
    });
}

// Console log thông báo khởi tạo thành công
console.log(`
╔══════════════════════════════════════╗
║      DẤU ẤN ĐỈNH THIÊNG YÊN TỬ      ║
║        Trường THCS Đông Xá          ╕
║                                      ║
║  Website đã sẵn sàng! Chào mừng!    ║
╚══════════════════════════════════════╝
`);
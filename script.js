document.addEventListener("DOMContentLoaded", function() {
    const filterButtons = document.querySelectorAll(".filter_buttons button");
    const filterableCards = document.querySelectorAll(".filterable_cards .card");
    const tags = document.querySelectorAll(".tag");
    const downloadButtons = document.querySelectorAll(".download-btn");
    const cardImages = document.querySelectorAll(".card_img");
    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");
    const closeBtn = document.querySelector(".close");
    const zoomInBtn = document.getElementById("zoomIn");
    const zoomOutBtn = document.getElementById("zoomOut");
    const resetZoomBtn = document.getElementById("resetZoom");
    
    let currentScale = 1;
    const scaleStep = 0.2;
    const maxScale = 3;
    const minScale = 0.5;

    // تابع اصلی برای فیلتر کردن کارت‌ها
    const filterCards = (filterValue) => {
        // به‌روزرسانی دکمه‌های فیلتر
        document.querySelector(".active").classList.remove("active");
        
        // پیدا کردن دکمه مربوطه و فعال کردن آن
        const targetButton = Array.from(filterButtons).find(button => 
            button.dataset.name === filterValue
        );
        if (targetButton) {
            targetButton.classList.add("active");
        }
        
        // فیلتر کردن کارت‌ها
        filterableCards.forEach(card => {
            const cardTags = card.dataset.tags.split(',');
            
            if (filterValue === "all" || cardTags.includes(filterValue)) {
                card.classList.remove("hide");
            } else {
                card.classList.add("hide");
            }
        });
    };

    // اضافه کردن event listener برای دکمه‌های فیلتر
    filterButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            filterCards(e.target.dataset.name);
        });
    });

    // اضافه کردن event listener برای تگ‌ها
    tags.forEach(tag => {
        tag.addEventListener("click", (e) => {
            e.stopPropagation(); // جلوگیری از انتشار رویداد
            const tagName = e.target.dataset.name;
            
            // اگر تگ مربوطه از قبل انتخاب نشده باشد
            const isTagAlreadyActive = document.querySelector(`.filter_buttons button[data-name="${tagName}"]`).classList.contains("active");
            
            if (!isTagAlreadyActive) {
                filterCards(tagName);
            }
        });
    });

    // اضافه کردن event listener برای دکمه‌های دانلود
    downloadButtons.forEach(button => {
        button.addEventListener("click", function(e) {
            e.stopPropagation();
            
            const fileUrl = this.dataset.url;
            const fileTitle = this.dataset.title;
            
            // شبیه‌سازی فرآیند دانلود
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال دانلود...';
            this.disabled = true;
            
            // ایجاد لینک دانلود بدون باز کردن تب جدید
            const downloadLink = document.createElement('a');
            downloadLink.href = fileUrl;
            downloadLink.style.display = 'none';
            
            // اضافه کردن لینک به صفحه و کلیک کردن روی آن
            document.body.appendChild(downloadLink);
            
            setTimeout(() => {
                try {
                    downloadLink.click();
                } catch (error) {
                    // هیچ پیامی نمایش داده نمی‌شود
                }
                
                // حذف لینک از صفحه
                document.body.removeChild(downloadLink);
                
                this.innerHTML = originalHTML;
                this.disabled = false;
            }, 1000);
        });
    });

    // نمایش تصویر در مودال با کلیک روی تصویر کارت
    cardImages.forEach(imageContainer => {
        imageContainer.addEventListener("click", function() {
            const img = this.querySelector('img');
            const imageSrc = img.getAttribute('data-src') || img.src;
            modalImage.src = imageSrc;
            modal.style.display = "block";
            currentScale = 1;
            modalImage.style.transform = `scale(${currentScale})`;
            document.body.style.overflow = "hidden"; // جلوگیری از اسکرول صفحه
        });
    });

    // بستن مودال
    closeBtn.addEventListener("click", function() {
        modal.style.display = "none";
        document.body.style.overflow = "auto"; // فعال کردن مجدد اسکرول
    });

    // بستن مودال با کلیک خارج از تصویر
    modal.addEventListener("click", function(e) {
        if (e.target === modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto"; // فعال کردن مجدد اسکرول
        }
    });

    // بزرگ کردن تصویر
    zoomInBtn.addEventListener("click", function() {
        if (currentScale < maxScale) {
            currentScale += scaleStep;
            modalImage.style.transform = `scale(${currentScale})`;
        }
    });

    // کوچک کردن تصویر
    zoomOutBtn.addEventListener("click", function() {
        if (currentScale > minScale) {
            currentScale -= scaleStep;
            modalImage.style.transform = `scale(${currentScale})`;
        }
    });

    // بازنشانی زوم
    resetZoomBtn.addEventListener("click", function() {
        currentScale = 1;
        modalImage.style.transform = `scale(${currentScale})`;
    });

    // بستن مودال با کلید ESC
    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape" && modal.style.display === "block") {
            modal.style.display = "none";
            document.body.style.overflow = "auto"; // فعال کردن مجدد اسکرول
        }
    });
});
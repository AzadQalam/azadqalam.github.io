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
        const prevActive = document.querySelector(".filter_buttons .active");
        if (prevActive) prevActive.classList.remove("active");
        
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
            const btn = document.querySelector(`.filter_buttons button[data-name="${tagName}"]`);
            const isTagAlreadyActive = btn ? btn.classList.contains("active") : false;
            
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

    // نمایش تصویر در مودال با کلیک روی تصویر کارت (همان رفتار نسخه‌ی 1)
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

    // بزرگ کردن تصویر (modal)
    zoomInBtn.addEventListener("click", function() {
        if (currentScale < maxScale) {
            currentScale += scaleStep;
            modalImage.style.transform = `scale(${currentScale})`;
        }
    });

    // کوچک کردن تصویر (modal)
    zoomOutBtn.addEventListener("click", function() {
        if (currentScale > minScale) {
            currentScale -= scaleStep;
            modalImage.style.transform = `scale(${currentScale})`;
        }
    });

    // بازنشانی زوم (modal)
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

    /* -----------------------------
       end of original ver1 logic
       -----------------------------*/
});

/* -----------------------------
   Latest font tester logic (added on top of ver1; doesn't modify ver1 behavior)
   This block loads fonts list via jsDelivr (fonts.json), populates the select
   alphabetically, and handles tester controls (wght, size, line-height, ss01, tnum, lang).
   -----------------------------*/
document.addEventListener("DOMContentLoaded", function() {
    const vf = {
        wght: document.getElementById('wght'),
        size: document.getElementById('size'),
        lh: document.getElementById('lh'),
        wghtValue: document.getElementById('wghtValue'),
        sizeValue: document.getElementById('sizeValue'),
        lhValue: document.getElementById('lhValue'),
        sampleInput: document.getElementById('sampleInput'),
        sample: document.getElementById('vfSample'),
        fontSelect: document.getElementById('vfFontSelect'),
        resetBtn: document.getElementById('resetVf'),
        langSelect: document.getElementById('vfLangSelect'),
        ss01: document.getElementById('ss01'),
        tnum: document.getElementById('tnum')
    };

    const sampleTexts = {
        fa: 'فاصلهٔ بین خط کرسی هر سطر تا خط کرسی سطر بعدی در هر متن را فاصلهٔ بین سطر یا پایه حروف می‌گویند. دلیل آن که کلمهٔ متن را بکار می‌بریم این است که مقدار این فاصله را می‌توان هنگام حروف‌چینی متن متناسب با نوع قلم آن تغییر داد. این فاصله نقش مهمی را هنگام خواندن ایفا می‌کند.\nاعداد: ۰۱۲۳۴۵۶۷۸۹',
        ar: 'المسافة بين خط الأساس لكل سطر وخط الأساس للسطر التالي في أي نص﻿ تُسمى مسافة السطر أو المسافة الأساسية للحروف﻿. والسبب في استخدامنا كلمة نص﻿ هو أنه يمكن تعديل مقدار هذه المسافة أثناء تنضيد النص حسب نوع الخط. تلعب هذه المسافة دورًا مهمًا أثناء القراءة.\nالأرقام: ٠١٢٣٤٥٦٧٨٩',
        ku: 'دووری نێوان خەت کرسی هەموو ڕیزێک و خەت کرسی ڕیزە داهاتوو لە هەر دەقێکدا﻿ دووری نێوان ڕیزە یان بەیدە هەروەها ناونراوە﻿. هۆکاری بەکارهێنانی وشەی دەق﻿ ئەوەیە کە مەقداری ئەم دووریا دەکرێت لەکاتی نوسینەوەی مەکۆ﻿ پێشنیار بکرێت بە پەیوەندی گۆڕینی فۆنت. ئەم دووریە شاندێکی گرنگ دەکات کاتێک دەتوانرێت خوێندراو.\nژمارەکان: ٠١٢٣٤٥٦٧٨٩',
        en: 'The distance between the baseline of each line and the baseline of the next line in any text is called the line spacing or leading. The reason we use the word "text" is that the amount of this spacing can be adjusted during typesetting according to the font type. This spacing plays an important role in reading.\nDigits: 0123456789'
    };

    // jsDelivr-hosted fonts JSON (sample repo). Update to actual path if needed.
    const fontsJsonUrl = 'https://cdn.jsdelivr.net/gh/AzadQalam/sample-fonts@main/fonts.json';

    const fallbackFonts = [
        { name: 'AQNormalSans-VF', family: 'AQNormalSans-VF', css: '' } // No CSS needed as it's loaded via @font-face
    ];

    function ensureCssLoaded(href) {
        if (!href) return Promise.resolve();
        if (document.querySelector(`link[data-font-href="${href}"]`)) return Promise.resolve();
        return new Promise((resolve) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.setAttribute('data-font-href', href);
            link.onload = () => resolve();
            link.onerror = () => resolve();
            document.head.appendChild(link);
        });
    }

    async function loadFontsList() {
        let fonts = fallbackFonts;
        try {
            const res = await fetch(fontsJsonUrl, { cache: 'force-cache' });
            if (res.ok) {
                const json = await res.json();
                if (Array.isArray(json) && json.length) {
                    fonts = json.map(f => ({
                        name: f.name || f.family || f,
                        family: f.family || f.name || f,
                        css: f.css || ''
                    }));
                }
            }
        } catch (e) {
            // fallback
        }

        fonts.sort((a, b) => a.name.localeCompare(b.name, 'fa', { sensitivity: 'base' }));

        // populate select
        vf.fontSelect.innerHTML = '';
        fonts.forEach(f => {
            const opt = document.createElement('option');
            opt.textContent = f.name;
            opt.value = f.family;
            if (f.css) opt.setAttribute('data-css', f.css);
            vf.fontSelect.appendChild(opt);
        });

        const prefer = 'AQNormalSans-VF';
        const preferredOption = Array.from(vf.fontSelect.options).find(o => o.value === prefer);
        if (preferredOption) vf.fontSelect.value = prefer;
        else if (vf.fontSelect.options.length) vf.fontSelect.selectedIndex = 0;

        const initialOpt = vf.fontSelect.options[vf.fontSelect.selectedIndex];
        const initialCss = initialOpt ? initialOpt.dataset.css : '';
        await ensureCssLoaded(initialCss);
        applyVfSettings();
    }

    const applyVfSettings = () => {
        const chosenFont = vf.fontSelect.value;
        vf.sample.style.fontFamily = chosenFont ? `'${chosenFont}', sans-serif` : "'AQNormalSans-VF', sans-serif";

        const wght = parseFloat(vf.wght.value || 100);
        const size = parseFloat(vf.size.value || 18);
        const lh = parseFloat(vf.lh.value || 1.5);

        vf.wghtValue.textContent = Math.round(wght);
        vf.sizeValue.textContent = Math.round(size);
        vf.lhValue.textContent = lh.toFixed(2);

        vf.sample.style.fontVariationSettings = `'wght' ${wght}`;
        vf.sample.style.fontSize = `${size}px`;
        vf.sample.style.lineHeight = `${lh}`;

        const features = [];
        if (vf.ss01.checked) features.push(`'ss01' 1`);
        if (vf.tnum.checked) features.push(`'tnum' 1`);
        vf.sample.style.fontFeatureSettings = features.join(', ');

        vf.sample.style.textAlign = 'right';

        const lang = vf.langSelect.value;
        if (lang === 'ar' || lang === 'fa' || lang === 'ku') vf.sample.setAttribute('dir', 'rtl');
        else vf.sample.setAttribute('dir', 'ltr');
    };

    // bootstrap
    loadFontsList();

    vf.fontSelect.addEventListener('change', async function() {
        const opt = this.options[this.selectedIndex];
        const css = opt ? opt.dataset.css : '';
        await ensureCssLoaded(css);
        applyVfSettings();
    });

    vf.wght.addEventListener('input', applyVfSettings);
    vf.size.addEventListener('input', applyVfSettings);
    vf.lh.addEventListener('input', applyVfSettings);
    vf.ss01.addEventListener('change', applyVfSettings);
    vf.tnum.addEventListener('change', applyVfSettings);
    vf.langSelect.addEventListener('change', function() {
        const val = this.value;
        const currentTextarea = vf.sampleInput.value || '';
        const defaultForLang = sampleTexts[val];
        const knownSamples = Object.values(sampleTexts);
        if (!currentTextarea || knownSamples.includes(currentTextarea)) {
            vf.sampleInput.value = defaultForLang;
            vf.sample.textContent = defaultForLang;
        } else {
            vf.sample.textContent = currentTextarea;
        }
        applyVfSettings();
    });

    vf.sampleInput.addEventListener('input', function() {
        vf.sample.textContent = this.value;
    });

    vf.sample.addEventListener('input', function() {
        vf.sampleInput.value = this.textContent;
    });

    vf.resetBtn.addEventListener('click', function() {
        vf.wght.value = 100;
        vf.size.value = 18;
        vf.lh.value = 1.5;
        vf.ss01.checked = false;
        vf.tnum.checked = false;
        const prefer = Array.from(vf.fontSelect.options).find(o => o.value === 'AQNormalSans-VF');
        if (prefer) vf.fontSelect.value = 'AQNormalSans-VF';
        else if (vf.fontSelect.options.length) vf.fontSelect.selectedIndex = 0;
        vf.langSelect.value = 'fa';
        vf.sampleInput.value = sampleTexts['fa'];
        vf.sample.textContent = vf.sampleInput.value;
        const opt = vf.fontSelect.options[vf.fontSelect.selectedIndex];
        const css = opt ? opt.dataset.css : '';
        ensureCssLoaded(css).then(applyVfSettings);
    });

    if (vf.sampleInput.value) vf.sample.textContent = vf.sampleInput.value;

    /* -----------------------------
       Add fold/unfold toggle logic for the tester (minimal; does not change other behavior)
       -----------------------------*/
    const vfToggleBtn = document.getElementById('vfToggleBtn');
    const vfWrapper = document.getElementById('vfWrapper');
    if (vfToggleBtn && vfWrapper) {
        vfToggleBtn.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            if (!expanded) {
                vfWrapper.classList.remove('collapsed');
                this.setAttribute('aria-expanded', 'true');
                this.textContent = 'بستن تست';
                // reapply settings after unfold
                setTimeout(() => { applyVfSettings(); const focusTarget = document.getElementById('wght'); if (focusTarget) focusTarget.focus(); }, 250);
            } else {
                vfWrapper.classList.add('collapsed');
                this.setAttribute('aria-expanded', 'false');
                this.textContent = 'تست آنلاین تمام فونت ها';
            }
        });
    }
});
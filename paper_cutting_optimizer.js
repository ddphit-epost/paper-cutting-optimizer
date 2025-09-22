class PrintCalculator {
    constructor() {
        this.sheetIndex = 0;
        this.commonSizes = [
            { length: 100, width: 70, name: 'فرخ كامل' },
            { length: 88, width: 66, name: 'جاير' },
            { length: 70, width: 50, name: 'نصف الفرخ' },
            { length: 50, width: 35, name: 'ربع الفرخ' },
            { length: 35, width: 25, name: 'ثمن الفرخ' }
        ];
        this.init();
    }

    init() {
        this.bindElements();
        this.bindEvents();
        this.populatePresetSheetsDropdown();
        this.updateEffectivePageSize();
        this.addDefaultSheets();
        this.enhanceUI();
    }

    bindElements() {
        this.elements = {
            pageLength: document.getElementById('pageLength'),
            pageWidth: document.getElementById('pageWidth'),
            margin: document.getElementById('margin'),
            numberOfPages: document.getElementById('numberOfPages'),
            numberOfCopies: document.getElementById('numberOfCopies'),
            printType: document.getElementById('printType'),
            printPrice: document.getElementById('printPrice'),
            sheetsContainer: document.getElementById('sheetsContainer'),
            presetSheetDropdown: document.getElementById('presetSheetDropdown'),
            addSelectedSheetBtn: document.getElementById('addSelectedSheetBtn'),
            addCustomBtn: document.getElementById('addCustomSheet'),
            calculateBtn: document.getElementById('calculateButton'),
            resultsContainer: document.getElementById('resultsContainer'),
            sheetResults: document.getElementById('sheetResults'),
            comparisonSummary: document.getElementById('comparisonSummary'),
            errorMessage: document.getElementById('error-message'),
            effectiveSize: document.getElementById('effectivePageSizeDisplay')
        };
        this.originalCalcBtnText = this.elements.calculateBtn.innerHTML;
    }

    bindEvents() {
        // Input validation and updates
        ['pageLength', 'pageWidth', 'margin'].forEach(field => {
            this.elements[field].addEventListener('input', () => this.updateEffectivePageSize());
        });

        // Sheet management
        this.elements.addSelectedSheetBtn.addEventListener('click', () => this.addSelectedSheet());
        this.elements.addCustomBtn.addEventListener('click', () => this.addCustomSheet());
        this.elements.sheetsContainer.addEventListener('click', (e) => this.handleSheetRemoval(e));

        // Main calculation
        this.elements.calculateBtn.addEventListener('click', () => this.calculate());

        // Keyboard shortcuts and print
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'Enter':
                        e.preventDefault();
                        this.elements.calculateBtn.click();
                        break;
                    case 'p':
                        e.preventDefault();
                        if (!this.elements.resultsContainer.classList.contains('hidden')) {
                            window.print();
                        }
                        break;
                }
            }
        });
    }

    populatePresetSheetsDropdown() {
        this.commonSizes.forEach((size, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${size.name} (${size.length} × ${size.width} سم)`;
            this.elements.presetSheetDropdown.appendChild(option);
        });
    }

    updateEffectivePageSize() {
        const pageLength = parseFloat(this.elements.pageLength.value) || 0;
        const pageWidth = parseFloat(this.elements.pageWidth.value) || 0;
        const margin = parseFloat(this.elements.margin.value) || 0;

        if (pageLength > 0 && pageWidth > 0 && margin >= 0) {
            const effectiveLength = pageLength + 2 * margin;
            const effectiveWidth = pageWidth + 2 * margin;
            this.elements.effectiveSize.innerHTML = `
                <strong>المقاس الفعلي (مع الهامش):</strong><br>
                ${effectiveLength.toFixed(2)} × ${effectiveWidth.toFixed(2)} سم
            `;
        } else {
            this.elements.effectiveSize.innerHTML = '';
        }
    }

    addSheet(length = '', width = '', name = 'مقاس مخصص') {
        const sheetDiv = document.createElement('div');
        sheetDiv.classList.add('sheet-item');
        sheetDiv.dataset.index = this.sheetIndex++;

        sheetDiv.innerHTML = `
            <div class="sheet-header">${name} ${length && width ? `(${length}×${width} سم)` : ''}</div>
            <div class="sheet-inputs">
                <input type="number" placeholder="الطول (سم)" value="${length}" 
                       class="form-input sheet-length" step="0.1" required>
                <input type="number" placeholder="العرض (سم)" value="${width}" 
                       class="form-input sheet-width" step="0.1" required>
                <input type="number" placeholder="سعر الفرخ (جنيه)" value="" 
                       class="form-input sheet-price" step="0.01" required>
                <button class="remove-btn" title="إزالة الفرخ">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="pointer-events: none;">
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </div>
        `;

        this.elements.sheetsContainer.appendChild(sheetDiv);
    }

    addSelectedSheet() {
        const selectedIndex = this.elements.presetSheetDropdown.value;
        if (selectedIndex === null || selectedIndex === '') return;

        const selectedSize = this.commonSizes[selectedIndex];
        const existingSheets = this.getExistingSheets();

        const isDuplicate = existingSheets.some(sheet => 
            (sheet.length == selectedSize.length && sheet.width == selectedSize.width) ||
            (sheet.length == selectedSize.width && sheet.width == selectedSize.length)
        );

        if (isDuplicate) {
            this.showError('هذا المقاس أو مقاس مطابق له موجود بالفعل.');
        } else {
            this.addSheet(selectedSize.length, selectedSize.width, selectedSize.name);
        }
    }

    addCustomSheet() {
        this.addSheet('', '', 'مقاس مخصص');
    }

    getExistingSheets() {
        return Array.from(this.elements.sheetsContainer.children).map(sheetDiv => ({
            length: parseFloat(sheetDiv.querySelector('.sheet-length').value) || 0,
            width: parseFloat(sheetDiv.querySelector('.sheet-width').value) || 0
        }));
    }

    handleSheetRemoval(e) {
        if (e.target.closest('.remove-btn')) {
            e.target.closest('.sheet-item').remove();
        }
    }

    addDefaultSheets() {
        this.addSheet(100, 70, this.commonSizes[0].name);
        this.addSheet(88, 66, this.commonSizes[1].name);
    }

    showError(message) {
        this.elements.errorMessage.textContent = message;
        this.elements.errorMessage.classList.remove('hidden');
        setTimeout(() => {
            this.elements.errorMessage.classList.add('hidden');
        }, 5000);
    }

    validateInputs() {
        const values = {
            pageLength: parseFloat(this.elements.pageLength.value),
            pageWidth: parseFloat(this.elements.pageWidth.value),
            margin: parseFloat(this.elements.margin.value),
            numberOfPages: parseInt(this.elements.numberOfPages.value),
            numberOfCopies: parseInt(this.elements.numberOfCopies.value),
            printPrice: parseFloat(this.elements.printPrice.value)
        };

        if (Object.values(values).some(v => isNaN(v) || v < 0) || 
            values.pageLength <= 0 || values.pageWidth <= 0 || 
            values.numberOfPages <= 0 || values.numberOfCopies <= 0) {
            throw new Error('يرجى إدخال قيم صحيحة لجميع الحقول المطلوبة.');
        }

        const sheets = this.getSheets();
        if (sheets.length === 0) {
            throw new Error('يرجى إضافة مقاس فرخ واحد على الأقل وإدخال بياناته كاملة.');
        }

        return { ...values, sheets };
    }

    getSheets() {
        return Array.from(this.elements.sheetsContainer.children).map(sheetDiv => {
            const length = parseFloat(sheetDiv.querySelector('.sheet-length').value);
            const width = parseFloat(sheetDiv.querySelector('.sheet-width').value);
            const price = parseFloat(sheetDiv.querySelector('.sheet-price').value);
            return { length, width, price };
        }).filter(s => !isNaN(s.length) && !isNaN(s.width) && !isNaN(s.price) && 
                     s.length > 0 && s.width > 0 && s.price >= 0);
    }

    calculateLayout(sheetWidth, sheetHeight, pageWidth, pageHeight, margin) {
        const effectivePageWidth = pageWidth + 2 * margin;
        const effectivePageHeight = pageHeight + 2 * margin;

        const calc = (sW, sH, pW, pH) => Math.floor(sW / pW) * Math.floor(sH / pH);

        const count1 = calc(sheetWidth, sheetHeight, effectivePageWidth, effectivePageHeight);
        const count2 = calc(sheetWidth, sheetHeight, effectivePageHeight, effectivePageWidth);

        let bestLayout;
        if (count1 >= count2) {
            bestLayout = {
                count: count1,
                orientation: 'طولي (Portrait)',
                layout: {
                    rows: Math.floor(sheetHeight / effectivePageHeight),
                    cols: Math.floor(sheetWidth / effectivePageWidth),
                    pageWidth: effectivePageWidth,
                    pageHeight: effectivePageHeight
                }
            };
        } else {
            bestLayout = {
                count: count2,
                orientation: 'عرضي (Landscape)', 
                layout: {
                    rows: Math.floor(sheetHeight / effectivePageWidth),
                    cols: Math.floor(sheetWidth / effectivePageHeight),
                    pageWidth: effectivePageHeight,
                    pageHeight: effectivePageWidth
                }
            };
        }

        const totalUsedArea = bestLayout.count * bestLayout.layout.pageWidth * bestLayout.layout.pageHeight;
        const sheetArea = sheetWidth * sheetHeight;
        const utilization = sheetArea > 0 ? (totalUsedArea / sheetArea) * 100 : 0;
        const wasteArea = sheetArea - totalUsedArea;

        return { ...bestLayout, utilization, wasteArea };
    }

    calculate() {
        this.elements.calculateBtn.innerHTML = '⏳ جاري الحساب...';
        this.elements.calculateBtn.disabled = true;

        setTimeout(() => {
            try {
                this.elements.errorMessage.classList.add('hidden');
                const inputs = this.validateInputs();
                const { sheets, ...productData } = inputs;
                
                const totalPrintedPages = productData.numberOfPages * productData.numberOfCopies;
                const totalPrintingCost = totalPrintedPages * productData.printPrice;
                
                const allResults = sheets.map(sheet => {
                    const result = this.calculateLayout(
                        sheet.width, sheet.length, 
                        productData.pageWidth, productData.pageLength, 
                        productData.margin
                    );
                    
                    const sidesPerSheet = this.elements.printType.value === 'doubleSided' ? 2 : 1;
                    const pagesPerSheet = result.count * sidesPerSheet;
                    const totalSheetsNeeded = pagesPerSheet > 0 ? Math.ceil(totalPrintedPages / pagesPerSheet) : 0;
                    const paperCost = totalSheetsNeeded * sheet.price;
                    
                    return {
                        ...result,
                        sheetLength: sheet.length,
                        sheetWidth: sheet.width,
                        sheetPrice: sheet.price,
                        totalSheetsNeeded,
                        paperCost,
                        totalCost: paperCost + totalPrintingCost,
                    };
                });
                
                this.displayResults(allResults, totalPrintingCost, totalPrintedPages);

            } catch (error) {
                this.showError(error.message);
            } finally {
                this.elements.calculateBtn.innerHTML = this.originalCalcBtnText;
                this.elements.calculateBtn.disabled = false;
            }
        }, 50);
    }

    displayResults(results, printingCost, totalPages) {
        if (results.length === 0) return;

        results.sort((a, b) => a.totalCost - b.totalCost);
        
        this.displayComparison(results, printingCost, totalPages);
        this.displaySheetResults(results);
        
        this.elements.resultsContainer.classList.remove('hidden');
        this.elements.resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }

    displayComparison(results, printingCost, totalPages) {
        const best = results[0];
        const worst = results[results.length - 1];
        const savings = worst.totalCost - best.totalCost;
        
        let html = `
            <div style="text-align: center; margin-bottom: 25px;">
                <h3 style="color: #1f2937; margin-bottom: 15px;">📈 تحليل شامل للتكاليف</h3>
                <div class="grid grid-cols-3" style="gap: 15px; margin-bottom: 20px;">
                    <div style="background: #ddd6fe; padding: 15px; border-radius: 12px;">
                        <div style="font-weight: bold; color: #5b21b6;">إجمالي الصفحات</div>
                        <div style="font-size: 1.5rem; color: #7c3aed;">${totalPages.toLocaleString()}</div>
                    </div>
                    <div style="background: #fef3c7; padding: 15px; border-radius: 12px;">
                        <div style="font-weight: bold; color: #92400e;">تكلفة الطباعة</div>
                        <div style="font-size: 1.5rem; color: #d97706;">${printingCost.toFixed(2)} جنيه</div>
                    </div>
                    <div style="background: #d1fae5; padding: 15px; border-radius: 12px;">
                        <div style="font-weight: bold; color: #065f46;">التوفير المحتمل</div>
                        <div style="font-size: 1.5rem; color: #059669;">${savings.toFixed(2)} جنيه</div>
                    </div>
                </div>
            </div>
            <div style="margin-bottom: 25px;">
                <h4 style="color: #374151; margin-bottom: 15px;">🏆 ترتيب المقاسات حسب التكلفة الإجمالية:</h4>
                <ol style="list-style: decimal; padding-right: 20px;">
        `;
        
        results.forEach((result, index) => {
            const rank = index + 1;
            const badge = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;
            const costPerPage = (result.totalCost / totalPages).toFixed(3);
            
            html += `
                <li style="margin-bottom: 12px; padding: 10px; background: ${rank === 1 ? '#ecfdf5' : '#f8fafc'}; 
                           border-radius: 8px; border-right: 4px solid ${rank === 1 ? '#10b981' : '#e5e7eb'};">
                    <strong>${badge} مقاس ${result.sheetLength}×${result.sheetWidth} سم:</strong><br>
                    <span style="color: #6b7280;">
                        التكلفة الإجمالية: <strong style="color: #1f2937;">${result.totalCost.toFixed(2)} جنيه</strong> | 
                        التكلفة لكل صفحة: <strong>${costPerPage} جنيه</strong> | 
                        عدد الأفرخ: <strong>${result.totalSheetsNeeded}</strong> | 
                        الاستفادة: <strong>${result.utilization.toFixed(1)}%</strong>
                    </span>
                </li>
            `;
        });
        
        html += `</ol></div>`;
        html += `
            <div class="recommendation">
                <h3>💡 التوصية النهائية</h3>
                <p style="font-size: 1.1rem; line-height: 1.6;">
                    <strong>أفضل مقاس للاستخدام:</strong> ${best.sheetLength}×${best.sheetWidth} سم<br>
                    <strong>السبب:</strong> يحقق أقل تكلفة إجمالية (${best.totalCost.toFixed(2)} جنيه) 
                    مع استفادة ${best.utilization.toFixed(1)}% من مساحة الفرخ.<br>
                    ${savings > 0 ? `<strong>التوفير المحتمل:</strong> توفر ${savings.toFixed(2)} جنيه مقارنة بأسوأ خيار.` : ''}
                </p>
            </div>
        `;
        
        this.elements.comparisonSummary.innerHTML = html;
    }

    displaySheetResults(results) {
        this.elements.sheetResults.innerHTML = '';
        const totalPages = parseInt(this.elements.numberOfPages.value) * parseInt(this.elements.numberOfCopies.value);

        results.forEach((result, index) => {
            const isOptimal = index === 0;
            const resultCard = document.createElement('div');
            resultCard.className = `result-card ${isOptimal ? 'best' : ''}`;
            
            resultCard.innerHTML = `
                <h3 style="font-size: 1.3rem; margin-bottom: 15px; color: ${isOptimal ? '#059669' : '#374151'};">
                    📋 فرخ ${result.sheetLength}×${result.sheetWidth} سم
                </h3>
                <div class="canvas-container">
                    <canvas width="280" height="280" id="canvas-${result.sheetLength}-${result.sheetWidth}-${index}"></canvas>
                </div>
                <ul class="stats-list">
                    <li><span class="stat-label">🔢 صفحات لكل فرخ:</span><span class="stat-value"><strong>${result.count}</strong></span></li>
                    <li><span class="stat-label">📄 عدد الأفرخ المطلوبة:</span><span class="stat-value"><strong>${result.totalSheetsNeeded}</strong></span></li>
                    <li><span class="stat-label">📊 نسبة الاستفادة:</span><span class="stat-value"><strong>${result.utilization.toFixed(2)}%</strong></span></li>
                    <li><span class="stat-label">💰 تكلفة الأوراق:</span><span class="stat-value"><strong>${result.paperCost.toFixed(2)} جنيه</strong></span></li>
                    <li><span class="stat-label">💳 التكلفة الإجمالية:</span><span class="stat-value"><strong>${result.totalCost.toFixed(2)} جنيه</strong></span></li>
                    <li><span class="stat-label">📐 مساحة الفاقد:</span><span class="stat-value">${result.wasteArea.toFixed(2)} سم²</span></li>
                    <li><span class="stat-label">🔄 التوجه الأمثل:</span><span class="stat-value">${result.orientation}</span></li>
                    <li><span class="stat-label">💵 التكلفة لكل صفحة:</span><span class="stat-value">${(result.totalCost / totalPages).toFixed(3)} جنيه</span></li>
                </ul>
                <div class="progress-bar" style="margin-top: 15px;">
                    <div class="progress-fill" style="width: ${result.utilization}%; background: ${isOptimal ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #6b7280, #4b5563)'};"></div>
                </div>
                <div style="text-align: center; margin-top: 5px; font-size: 0.8rem; color: #6b7280;">استفادة من مساحة الفرخ</div>
            `;
            
            this.elements.sheetResults.appendChild(resultCard);
            
            setTimeout(() => {
                const canvas = document.getElementById(`canvas-${result.sheetLength}-${result.sheetWidth}-${index}`);
                if (canvas) {
                    this.drawLayout(canvas, result.sheetWidth, result.sheetLength, result.layout, isOptimal);
                }
            }, 100);
        });
    }

    drawLayout(canvas, sheetWidth, sheetHeight, layout, isOptimal) {
        const ctx = canvas.getContext('2d');
        const padding = 20;
        const availableWidth = canvas.width - 2 * padding;
        const availableHeight = canvas.height - 2 * padding;
        
        const scale = Math.min(availableWidth / sheetWidth, availableHeight / sheetHeight);
        const scaledWidth = sheetWidth * scale;
        const scaledHeight = sheetHeight * scale;
        
        const offsetX = (canvas.width - scaledWidth) / 2;
        const offsetY = (canvas.height - scaledHeight) / 2;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = isOptimal ? '#ecfdf5' : '#f8fafc';
        ctx.fillRect(offsetX, offsetY, scaledWidth, scaledHeight);
        ctx.strokeStyle = isOptimal ? '#10b981' : '#64748b';
        ctx.strokeRect(offsetX, offsetY, scaledWidth, scaledHeight);
        
        ctx.fillStyle = isOptimal ? 'rgba(16, 185, 129, 0.3)' : 'rgba(100, 116, 139, 0.3)';
        ctx.strokeStyle = isOptimal ? '#059669' : '#475569';
        
        for (let row = 0; row < layout.rows; row++) {
            for (let col = 0; col < layout.cols; col++) {
                const x = offsetX + col * layout.pageWidth * scale;
                const y = offsetY + row * layout.pageHeight * scale;
                const w = layout.pageWidth * scale;
                const h = layout.pageHeight * scale;
                ctx.fillRect(x, y, w, h);
                ctx.strokeRect(x, y, w, h);
            }
        }
    }

    enhanceUI() {
        // Add hover effects to cards
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.boxShadow = '0 25px 50px rgba(0,0,0,0.15)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
            });
        });

        // Add form validation visual feedback
        document.querySelectorAll('.form-input').forEach(input => {
            input.addEventListener('blur', () => {
                if (input.checkValidity && !input.checkValidity()) {
                     input.style.borderColor = '#ef4444';
                } else {
                    input.style.borderColor = '';
                }
            });
        });
    }
}

// Initialize the app
new PrintCalculator();

// Register Service Worker for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => console.log('ServiceWorker registration successful'))
            .catch(err => console.log('ServiceWorker registration failed: ', err));
    });
}
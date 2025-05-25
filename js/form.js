document.addEventListener('DOMContentLoaded', function() {
    // Основные элементы формы
    const form = document.getElementById('applicationForm');
    const phoneInput = form.querySelector('input[name="phone"]');
    const nameInput = form.querySelector('input[name="name"]');
    const reasonInput = form.querySelector('textarea[name="reason"]');
    const submitBtn = form.querySelector('button[type="submit"]');
    const loader = submitBtn.querySelector('.ui-loader');
    
    // Отключаем стандартную валидацию браузера
    form.setAttribute('novalidate', true);
    
    // Константы для маски телефона
    const maskTemplate = '+52 ___ ___ ____';
    const editablePartStart = 4;
    let isPhoneActive = false;

    // Инициализация маски телефона
    function initPhoneMask() {
        phoneInput.addEventListener('focus', onPhoneFocus);
        phoneInput.addEventListener('blur', onPhoneBlur);
        phoneInput.addEventListener('input', onPhoneInput);
        phoneInput.addEventListener('keydown', onPhoneKeyDown);
        phoneInput.addEventListener('click', onPhoneClick);
    }

    // Инициализация анимации лейблов
    function initLabelAnimations() {
        form.querySelectorAll('.ui-field__label').forEach(label => {
            const input = label.querySelector('input, textarea');
            
            input.addEventListener('focus', function() {
                label.classList.add('ui-field--active');
                if (input === phoneInput && !isPhoneActive) {
                    activatePhoneField();
                }
            });
            
            input.addEventListener('blur', function() {
                if (this.value === '' || (this === phoneInput && (this.value === maskTemplate || !isPhoneActive))) {
                    label.classList.remove('ui-field--active');
                }
            });
            
            if (input.value && input.value !== maskTemplate) {
                label.classList.add('ui-field--active');
            }
        });
    }

    // Показать ошибку для поля
    function showError(field, message) {
        const fieldContainer = field.closest('.ui-field');
        const errorSpan = fieldContainer.querySelector('.ui-field__desc');
        
        fieldContainer.classList.add('ui-field--error');
        errorSpan.textContent = message;
        errorSpan.classList.add('ui-field__desc--error');
    }

    // Очистить ошибку поля
    function clearError(field) {
        const fieldContainer = field.closest('.ui-field');
        const errorSpan = fieldContainer.querySelector('.ui-field__desc');
        
        fieldContainer.classList.remove('ui-field--error');
        errorSpan.textContent = '';
        errorSpan.classList.remove('ui-field__desc--error');
    }

    // Активация поля телефона
    function activatePhoneField() {
        if (!isPhoneActive) {
            phoneInput.value = maskTemplate;
            isPhoneActive = true;
        }
        // Устанавливаем курсор на первую редактируемую позицию
        setTimeout(() => {
            phoneInput.setSelectionRange(editablePartStart, editablePartStart);
        }, 0);
        clearError(phoneInput);
    }

    // Обработчики событий для телефона
    function onPhoneClick() {
        if (!isPhoneActive) {
            activatePhoneField();
        } else {
            // Если поле уже активно, устанавливаем курсор в правильное место
            const pos = Math.max(phoneInput.selectionStart, editablePartStart);
            phoneInput.setSelectionRange(pos, pos);
        }
    }
    
    function onPhoneFocus() {
        if (!isPhoneActive) {
            activatePhoneField();
        } else {
            // Если поле уже активно, устанавливаем курсор в правильное место
            const pos = Math.max(phoneInput.selectionStart, editablePartStart);
            phoneInput.setSelectionRange(pos, pos);
        }
    }

    function onPhoneBlur() {
        const digits = getDigitsFromInput();
        if (digits.length < 10 || phoneInput.value.includes('_')) {
            phoneInput.value = '';
            isPhoneActive = false;
            clearError(phoneInput);
        }
    }

    function onPhoneInput() {
        if (!isPhoneActive) return;
        
        const digits = getDigitsFromInput();
        const selectionStart = phoneInput.selectionStart;
        
        if (!digits.length) {
            phoneInput.value = maskTemplate;
            phoneInput.setSelectionRange(editablePartStart, editablePartStart);
            return;
        }
        
        phoneInput.value = formatPhoneNumber(digits);
        
        // Вычисляем новую позицию курсора
        let newCursorPos = getNextCursorPosition(selectionStart, digits.length);
        // Убеждаемся, что курсор не попадет в нередактируемую часть
        newCursorPos = Math.max(newCursorPos, editablePartStart);
        
        setTimeout(() => {
            phoneInput.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
        
        clearError(phoneInput);
    }

    function onPhoneKeyDown(e) {
        if (!isPhoneActive) {
            e.preventDefault();
            activatePhoneField();
            return;
        }
        
        if ([8, 9, 27, 13, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) return;
        if ((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
        if (phoneInput.selectionStart < editablePartStart) {
            e.preventDefault();
            phoneInput.setSelectionRange(editablePartStart, editablePartStart);
        }
    }

    // Вспомогательные функции для телефона
    function getDigitsFromInput() {
        const value = phoneInput.value;
        let digits = '';
        
        for (let i = editablePartStart; i < value.length; i++) {
            if (/\d/.test(value[i])) digits += value[i];
        }
        
        return digits;
    }

    function formatPhoneNumber(digits) {
        let result = maskTemplate.split('');
        let digitIndex = 0;
        
        for (let i = editablePartStart; i < result.length && digitIndex < digits.length; i++) {
            if (result[i] === '_') {
                result[i] = digits[digitIndex++];
            }
        }
        
        return result.join('');
    }

    function getNextCursorPosition(currentPos, digitsLength) {
        const value = phoneInput.value;
        
        for (let i = Math.max(currentPos, editablePartStart); i < value.length; i++) {
            if (value[i] === '_') return i;
        }
        
        return value.length;
    }

    // Валидация формы
    function validateForm() {
        let isValid = true;

        // Валидация имени
        if (!nameInput.value.trim()) {
            showError(nameInput, 'Por favor ingrese su nombre');
            isValid = false;
        }

        // Валидация телефона
        const phoneDigits = getDigitsFromInput();
        if (phoneDigits.length < 10) {
            showError(phoneInput, 'Ingrese un número de 10 dígitos');
            isValid = false;
        }

        // Валидация причины (последнее поле)
        if (!reasonInput.value.trim()) {
            showError(reasonInput, 'Por favor indique la razón de su solicitud');
            isValid = false;
        }

        return isValid;
    }

    async function sendToCRM(formData) {
        try {
            console.log('Sending to CRM:', formData);    
            const response = await fetch('https://api.crm.com/leads', {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer YOUR_API_KEY'
                },
                body: JSON.stringify(formData)
            });
            console.log('CRM response status:', response.status);  
            return true;
        } catch (error) {
                console.error('Error sending to CRM:', error);
                return false;
        }
    }

    // Функция для сохранения в Google Sheets
    function backupToGoogleSheets(formData) {
        return new Promise((resolve, reject) => {
          const callbackName = 'jsonp_callback_' + Math.random().toString(36).substr(2, 9);
          const scriptId = 'jsonp_script_' + callbackName;
      
          // Удаляем предыдущие callback и script если существуют
          if (window[callbackName]) {
            delete window[callbackName];
          }
          const oldScript = document.getElementById(scriptId);
          if (oldScript) {
            document.body.removeChild(oldScript);
          }
      
          // Создаем URL с параметрами
          const url = new URL('https://script.google.com/macros/s/AKfycbzVLPTcERrAr4TehFXdcgcH_gW57jCC8s3mpmb92fPExDFOCcGP6cALQMJw-t0HceO9/exec');
          url.searchParams.append('callback', callbackName);
          
          // Добавляем данные в URL (для GET запроса)
          for (const key in formData) {
            if (formData.hasOwnProperty(key)) {
              url.searchParams.append(key, formData[key]);
            }
          }
      
          // Создаем callback функцию
          window[callbackName] = (response) => {
            // Очистка
            delete window[callbackName];
            const script = document.getElementById(scriptId);
            if (script) {
              document.body.removeChild(script);
            }
      
            // Обработка ответа
            if (response && response.success) {
              resolve(response);
            } else {
              reject(new Error(response.error || 'Unknown server error'));
            }
          };
      
          // Создаем script элемент
          const script = document.createElement('script');
          script.id = scriptId;
          script.src = url.toString();
          
          // Обработка ошибок загрузки
          script.onerror = () => {
            delete window[callbackName];
            reject(new Error('Failed to load the script'));
          };
          
          document.body.appendChild(script);
      
          // Таймаут на случай если сервер не ответит
          setTimeout(() => {
            if (window[callbackName]) {
              delete window[callbackName];
              const script = document.getElementById(scriptId);
              if (script) {
                document.body.removeChild(script);
              }
              reject(new Error('Request timeout'));
            }
          }, 10000); // 10 секунд таймаут
        });
      }

    // Обработка отправки формы
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Очищаем предыдущие ошибки
        form.querySelectorAll('.ui-field').forEach(field => {
            field.classList.remove('ui-field--error');
            const desc = field.querySelector('.ui-field__desc');
            desc.textContent = '';
            desc.classList.remove('ui-field__desc--error');
        });

        if (!validateForm()) return;

        try {
            submitBtn.disabled = true;
            loader.style.display = 'flex';
            submitBtn.querySelector('.ui-button__text').style.visibility = 'hidden';

            const formData = {
                name: nameInput.value.trim().replace(/[&<>"'`=\/]/g, ''),
                phone: '+52' + getDigitsFromInput(),
                instagram: form.querySelector('input[name="instagram"]').value.trim() || 'Not specified',
                reason: reasonInput.value.trim(),
                date: new Date().toISOString().slice(0, 19).replace('T', ' ')
            };

            // Пытаемся отправить в CRM (основной способ)
            const crmSuccess = await sendToCRM(formData);

            // Всегда сохраняем в Google Sheets как резервный вариант
            await backupToGoogleSheets(formData).catch(e => {
                console.error('Backup also failed:', e);
              });

            const successMessage = document.querySelector('.message__success');
            successMessage.style.display = 'flex';
            form.reset();
            phoneInput.value = '';
            isPhoneActive = false;

            document.querySelector('.message__close-btn').addEventListener('click', function() {
                successMessage.style.display = 'none';
            });
            
            // Сбросить состояния лейблов
            form.querySelectorAll('.ui-field__label').forEach(label => {
                label.classList.remove('ui-field--active');
            });

        } catch (error) {
            console.error('Error:', error);
            showError(reasonInput, 'Error al enviar. Intente nuevamente.');
        } finally {
            submitBtn.disabled = false;
            loader.style.display = 'none';
            submitBtn.querySelector('.ui-button__text').style.visibility = 'visible';
        }
    });

    // Очистка ошибок при вводе
    form.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', function() {
            const field = this.closest('.ui-field');
            field.classList.remove('ui-field--error');
            const desc = field.querySelector('.ui-field__desc');
            desc.textContent = '';
            desc.classList.remove('ui-field__desc--error');
        });
    });

    // Инициализация
    initPhoneMask();
    initLabelAnimations();
});
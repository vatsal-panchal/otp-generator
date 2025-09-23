        let currentOTP = '';
        let attempts = 0;
        let maxAttempts = 3;
        let timerInterval;
        let expiryTime = 0;

        function generateOTP() {
            const userId = document.getElementById('userId').value.trim();
            
            if (!userId) {
                showMessage('Please enter your email or username', 'error');
                return;
            }

            currentOTP = Math.floor(100000 + Math.random() * 900000).toString();
            attempts = 0;
            expiryTime = Date.now() + 60000; // 60 seconds

            document.getElementById('otpSection').classList.remove('hidden');
            document.getElementById('otpCode').textContent = currentOTP;
            document.getElementById('generateBtn').textContent = 'Resend OTP';
            document.getElementById('otpInput').value = '';
            document.getElementById('message').innerHTML = '';
            
            updateAttempts();
            startTimer();
        }

        function startTimer() {
            clearInterval(timerInterval);
            
            timerInterval = setInterval(() => {
                const remaining = Math.max(0, Math.floor((expiryTime - Date.now()) / 1000));
                const timerEl = document.getElementById('timer');
                
                if (remaining > 0) {
                    timerEl.textContent = `OTP expires in ${remaining} seconds`;
                    timerEl.classList.remove('expired');
                } else {
                    timerEl.textContent = 'OTP has expired. Click "Resend OTP" to get a new code.';
                    timerEl.classList.add('expired');
                    currentOTP = '';
                    clearInterval(timerInterval);
                }
            }, 1000);
        }

        function verifyOTP() {
            const input = document.getElementById('otpInput').value.trim();
            
            if (!input) {
                showMessage('Please enter the OTP', 'error');
                return;
            }

            if (!currentOTP) {
                showMessage('OTP has expired. Please generate a new one.', 'error');
                return;
            }

            attempts++;

            if (input === currentOTP) {
                showMessage('✓ OTP verified successfully!', 'success');
                clearInterval(timerInterval);
                document.getElementById('otpSection').classList.add('hidden');
                document.getElementById('generateBtn').textContent = 'Send OTP';
                currentOTP = '';
            } else {
                if (attempts >= maxAttempts) {
                    showMessage('Too many failed attempts. Please generate a new OTP.', 'error');
                    clearInterval(timerInterval);
                    document.getElementById('otpSection').classList.add('hidden');
                    document.getElementById('generateBtn').textContent = 'Send OTP';
                    currentOTP = '';
                    attempts = 0;
                } else {
                    showMessage(`Incorrect OTP. ${maxAttempts - attempts} attempts remaining.`, 'error');
                }
            }
            
            updateAttempts();
        }

        function updateAttempts() {
            const attemptsEl = document.getElementById('attempts');
            if (currentOTP && attempts > 0) {
                attemptsEl.textContent = `Attempt ${attempts} of ${maxAttempts}`;
            } else {
                attemptsEl.textContent = '';
            }
        }

        function showMessage(text, type) {
            const messageEl = document.getElementById('message');
            messageEl.textContent = text;
            messageEl.className = `message ${type}`;
        }

        document.getElementById('userId').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') generateOTP();
        });

        document.getElementById('otpInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') verifyOTP();
        });

        document.getElementById('otpInput').addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
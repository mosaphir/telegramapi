async function sendMessage() {
    const botToken = $('#botToken').val();
    const chatId = $('#chatId').val();
    const message = $('#message').val();
    const imageUrl = $('#imageUrl').val();
    const buttonText1 = $('#buttonText1').val();
    const buttonUrl1 = $('#buttonUrl1').val();
    const buttonText2 = $('#buttonText2').val();
    const buttonUrl2 = $('#buttonUrl2').val();

    let data = {
        chat_id: chatId,
        text: message,
        reply_markup: {
            inline_keyboard: [
                [{ text: buttonText1, url: buttonUrl1 }],
                [{ text: buttonText2, url: buttonUrl2 }]
            ]
        }
    };

    let apiMethod = 'sendMessage';

    if (imageUrl) {
        apiMethod = 'sendPhoto';
        data = {
            chat_id: chatId,
            photo: imageUrl,
            caption: message,
            reply_markup: {
                inline_keyboard: [
                    [{ text: buttonText1, url: buttonUrl1 }],
                    [{ text: buttonText2, url: buttonUrl2 }]
                ]
            }
        };
    }

    $.ajax({
        url: `https://api.telegram.org/bot${botToken}/${apiMethod}`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            $('#responseMessage').html(`<div class="alert alert-success" role="alert">Message sent!</div>`);
        },
        error: function(err) {
            $('#responseMessage').html(`<div class="alert alert-danger" role="alert">Error sending message</div>`);
            console.log(err);
        }
    });
}

function showInputFields() {
    const apiMethod = $('#apiMethod').val();
    let additionalFields = '';

    if (apiMethod === 'sendMessage') {
        additionalFields += `
            <div class="form-group">
                <label for="message">Message</label>
                <textarea class="form-control" id="message" rows="3" placeholder="Enter your message"></textarea>
            </div>
        `;
    } else if (apiMethod === 'sendPhoto' || apiMethod === 'sendVideo' || apiMethod === 'sendVoice') {
        additionalFields += `
            <div class="form-group">
                <label for="fileUrl">File URL</label>
                <input type="text" class="form-control" id="fileUrl" placeholder="Enter File URL">
            </div>
            <div class="form-group">
                <label for="caption">Caption</label>
                <textarea class="form-control" id="caption" rows="3" placeholder="Enter caption"></textarea>
            </div>
        `;
    } else if (apiMethod === 'uploadFile') {
        additionalFields += `
            <div class="form-group">
                <label for="file">File</label>
                <input type="file" class="form-control" id="file">
            </div>
        `;
    }

    $('#additionalFields').html(additionalFields);
}

async function executeApiMethod() {
    const botToken = $('#botToken').val();
    const chatId = $('#chatId').val();
    const apiMethod = $('#apiMethod').val();

    let data = {
        chat_id: chatId
    };

    if (apiMethod === 'sendMessage') {
        data.text = $('#message').val();
    } else if (apiMethod === 'sendPhoto' || apiMethod === 'sendVideo' || apiMethod === 'sendVoice') {
        data[apiMethod === 'sendPhoto' ? 'photo' : apiMethod === 'sendVideo' ? 'video' : 'voice'] = $('#fileUrl').val();
        data.caption = $('#caption').val();
    } else if (apiMethod === 'uploadFile') {
        const file = $('#file').prop('files')[0];
        const formData = new FormData();
        formData.append('chat_id', chatId);
        formData.append('document', file);
        
        await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
            method: 'POST',
            body: formData
        }).then(response => response.json())
          .then(data => $('#apiResponseMessage').html(`<div class="alert alert-success" role="alert">File uploaded successfully!</div>`))
          .catch(err => $('#apiResponseMessage').html(`<div class="alert alert-danger" role="alert">Error uploading file</div>`));
        
        return;
    }

    $.ajax({
        url: `https://api.telegram.org/bot${botToken}/${apiMethod}`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            $('#apiResponseMessage').html(`<div class="alert alert-success" role="alert">API method executed successfully!</div>`);
        },
        error: function(err) {
            $('#apiResponseMessage').html(`<div class="alert alert-danger" role="alert">Error executing API method</div>`);
            console.log(err);
        }
    });
}

async function setWebhook() {
    const botToken = $('#botToken').val();
    const webhookUrl = $('#webhookUrl').val();

    $.ajax({
        url: `https://api.telegram.org/bot${botToken}/setWebhook`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ url: webhookUrl }),
        success: function(response) {
            $('#webhookResponseMessage').html(`<div class="alert alert-success" role="alert">Webhook set successfully!</div>`);
        },
        error: function(err) {
            $('#webhookResponseMessage').html(`<div class="alert alert-danger" role="alert">Error setting webhook</div>`);
            console.log(err);
        }
    });
}

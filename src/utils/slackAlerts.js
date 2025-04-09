import axios from 'axios';

const sendSlackAlert = async (message) => {
  if (!process.env.SLACK_WEBHOOK_URL) return;
  try {
    await axios.post(process.env.SLACK_WEBHOOK_URL, {
      text: `🚨 *Claim API Alert*\n${message}`
    });
  } catch (err) {
    console.error('❌ Failed to send Slack alert:', err.message);
  }
};

export default sendSlackAlert;

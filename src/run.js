import { handler } from './index'

handler(null, null, (error, data) => {
  if (error) console.error('Callback error:', error);
  else console.log('Callback data:', data);
});

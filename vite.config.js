import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        roomDetail: './public/room-detail.html',
        booking: './public/booking.html',
        bookingStatus: './public/booking-status.html',
        login: './public/login.html',
        admin: './admin/index.html',
        tenant: './tenant/index.html'
      }
    }
  }
});

import { rest } from 'msw';
import { setupServer } from 'msw/node';

const handlers = [
  rest.get('*/project-settings', (req, res, ctx) => {
    return res(
      ctx.delay(100),
      ctx.status(200),
      ctx.json({
        menuLogo: {
          ext: '.svg',
          height: 256,
          name: 'michka.svg',
          size: 1.3,
          url: '/uploads/michka.svg',
          width: 256,
        },
      })
    );
  }),
  rest.post('*/project-settings', (req, res, ctx) => {
    return res(
      ctx.delay(100),
      ctx.status(200),
      ctx.json({
        menuLogo: {
          ext: '.svg',
          height: 256,
          name: 'michka.svg',
          size: 1.3,
          url: '/uploads/michka.svg',
          width: 256,
        },
      })
    );
  }),
];

const server = setupServer(...handlers);

export default server;

import { router } from "./trpc";
import { productsRouter } from "./routers/products";
import { ordersRouter } from "./routers/orders";
import { financeRouter } from "./routers/finance";
import { exchangesRouter } from "./routers/exchanges";
import { logisticsRouter } from "./routers/logistics";
import { disputesRouter } from "./routers/disputes";
import { lostFoundRouter } from "./routers/lost-found";
import { usersRouter } from "./routers/users";

export const appRouter = router({
  products: productsRouter,
  orders: ordersRouter,
  finance: financeRouter,
  exchanges: exchangesRouter,
  logistics: logisticsRouter,
  disputes: disputesRouter,
  lostFound: lostFoundRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;

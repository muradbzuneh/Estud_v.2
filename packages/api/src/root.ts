import { router } from "./core/trpc";
import { authRouter } from "./modules/auth/auth.router";
import { productsRouter } from "./modules/products/products.router";
import { ordersRouter } from "./modules/orders/orders.router";
import { financeRouter } from "./modules/finance/finance.router";
import { exchangesRouter } from "./modules/exchanges/exchanges.router";
import { logisticsRouter } from "./modules/logistics/logistics.router";
import { disputesRouter } from "./modules/disputes/disputes.router";
import { lostFoundRouter } from "./modules/lost-found/lost-found.router";
import { uploadRouter } from "./modules/upload/upload.router";

export const appRouter = router({
  auth: authRouter,
  products: productsRouter,
  orders: ordersRouter,
  finance: financeRouter,
  exchanges: exchangesRouter,
  logistics: logisticsRouter,
  disputes: disputesRouter,
  lostFound: lostFoundRouter,
  upload: uploadRouter,
});

export type AppRouter = typeof appRouter;

import { relations } from "drizzle-orm";
import {
  users,
  profiles,
  institutions,
  campuses,
  locations,
  permissions,
} from "./users";
import {
  categories,
  products,
  productImages,
  productAttributes,
  listingSubmissions,
  valuations,
  listingApprovals,
  educationalMaterials,
  productReports,
} from "./products";
import {
  orders,
  orderItems,
  orderTimeline,
  exchanges,
  exchangeItems,
} from "./orders";
import {
  payments,
  paymentEvidence,
  commissionRecords,
  sellerPayouts,
  refunds,
} from "./finance";
import { deliveries, deliveryAssignments } from "./logistics";
import { transactionDisputes, disputeEvidence } from "./disputes";
import {
  lostFoundReports,
  lostFoundImages,
  recoveryClaims,
} from "./lost-found";
import { auditLogs, notifications } from "./audit";

// Users Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
  products: many(products),
  buyerOrders: many(orders, { relationName: "buyer_orders" }),
  sellerOrders: many(orders, { relationName: "seller_orders" }),
  paymentsUploaded: many(paymentEvidence),
  payouts: many(sellerPayouts),
  notifications: many(notifications),
  auditLogs: many(auditLogs),
  disputesRaised: many(transactionDisputes),
  assignedDeliveries: many(deliveries),
  assignedTasks: many(deliveryAssignments, { relationName: "agent_assignments" }),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
  institution: one(institutions, {
    fields: [profiles.institutionId],
    references: [institutions.id],
  }),
  campus: one(campuses, {
    fields: [profiles.campusId],
    references: [campuses.id],
  }),
  defaultLocation: one(locations, {
    fields: [profiles.defaultLocationId],
    references: [locations.id],
  }),
}));

export const institutionsRelations = relations(institutions, ({ many }) => ({
  campuses: many(campuses),
  profiles: many(profiles),
  products: many(products),
  lostFoundReports: many(lostFoundReports),
}));

export const campusesRelations = relations(campuses, ({ one, many }) => ({
  institution: one(institutions, {
    fields: [campuses.institutionId],
    references: [institutions.id],
  }),
  profiles: many(profiles),
  products: many(products),
  lostFoundReports: many(lostFoundReports),
}));

// Products Relations
export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "category_hierarchy",
  }),
  subcategories: many(categories, { relationName: "category_hierarchy" }),
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  seller: one(users, {
    fields: [products.sellerId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  location: one(locations, {
    fields: [products.locationId],
    references: [locations.id],
  }),
  institution: one(institutions, {
    fields: [products.institutionId],
    references: [institutions.id],
  }),
  campus: one(campuses, {
    fields: [products.campusId],
    references: [campuses.id],
  }),
  images: many(productImages),
  attributes: many(productAttributes),
  submissions: many(listingSubmissions),
  valuations: many(valuations),
  approvals: many(listingApprovals),
  educationalMaterial: one(educationalMaterials, {
    fields: [products.id],
    references: [educationalMaterials.productId],
  }),
  orders: many(orders),
  reports: many(productReports),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const productAttributesRelations = relations(
  productAttributes,
  ({ one }) => ({
    product: one(products, {
      fields: [productAttributes.productId],
      references: [products.id],
    }),
  })
);

export const listingSubmissionsRelations = relations(
  listingSubmissions,
  ({ one }) => ({
    product: one(products, {
      fields: [listingSubmissions.productId],
      references: [products.id],
    }),
    submittedByUser: one(users, {
      fields: [listingSubmissions.submittedByUserId],
      references: [users.id],
    }),
  })
);

export const valuationsRelations = relations(valuations, ({ one }) => ({
  product: one(products, {
    fields: [valuations.productId],
    references: [products.id],
  }),
  admin: one(users, {
    fields: [valuations.adminId],
    references: [users.id],
  }),
}));

export const listingApprovalsRelations = relations(
  listingApprovals,
  ({ one }) => ({
    product: one(products, {
      fields: [listingApprovals.productId],
      references: [products.id],
    }),
    admin: one(users, {
      fields: [listingApprovals.adminId],
      references: [users.id],
    }),
  })
);

export const educationalMaterialsRelations = relations(
  educationalMaterials,
  ({ one }) => ({
    product: one(products, {
      fields: [educationalMaterials.productId],
      references: [products.id],
    }),
  })
);

// Orders & Exchanges Relations
export const ordersRelations = relations(orders, ({ one, many }) => ({
  buyer: one(users, {
    fields: [orders.buyerId],
    references: [users.id],
    relationName: "buyer_orders",
  }),
  seller: one(users, {
    fields: [orders.sellerId],
    references: [users.id],
    relationName: "seller_orders",
  }),
  product: one(products, {
    fields: [orders.productId],
    references: [products.id],
  }),
  items: many(orderItems),
  payments: many(payments),
  payout: one(sellerPayouts, {
    fields: [orders.id],
    references: [sellerPayouts.orderId],
  }),
  timeline: many(orderTimeline),
  delivery: one(deliveries, {
    fields: [orders.id],
    references: [deliveries.orderId],
  }),
  dispute: one(transactionDisputes, {
    fields: [orders.id],
    references: [transactionDisputes.orderId],
  }),
  commission: one(commissionRecords, {
    fields: [orders.id],
    references: [commissionRecords.orderId],
  }),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const orderTimelineRelations = relations(orderTimeline, ({ one }) => ({
  order: one(orders, {
    fields: [orderTimeline.orderId],
    references: [orders.id],
  }),
  actor: one(users, {
    fields: [orderTimeline.actorId],
    references: [users.id],
  }),
}));

export const exchangesRelations = relations(exchanges, ({ one, many }) => ({
  requester: one(users, {
    fields: [exchanges.requesterId],
    references: [users.id],
    relationName: "exchange_requester",
  }),
  receiver: one(users, {
    fields: [exchanges.receiverId],
    references: [users.id],
    relationName: "exchange_receiver",
  }),
  offeredProduct: one(products, {
    fields: [exchanges.offeredProductId],
    references: [products.id],
    relationName: "offered_product",
  }),
  requestedProduct: one(products, {
    fields: [exchanges.requestedProductId],
    references: [products.id],
    relationName: "requested_product",
  }),
  items: many(exchangeItems),
  payments: many(payments),
  delivery: one(deliveries, {
    fields: [exchanges.id],
    references: [deliveries.exchangeId],
  }),
  dispute: one(transactionDisputes, {
    fields: [exchanges.id],
    references: [transactionDisputes.exchangeId],
  }),
}));

export const exchangeItemsRelations = relations(exchangeItems, ({ one }) => ({
  exchange: one(exchanges, {
    fields: [exchangeItems.exchangeId],
    references: [exchanges.id],
  }),
  product: one(products, {
    fields: [exchangeItems.productId],
    references: [products.id],
  }),
}));

// Finance Relations
export const paymentsRelations = relations(payments, ({ one, many }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
  exchange: one(exchanges, {
    fields: [payments.exchangeId],
    references: [exchanges.id],
  }),
  confirmedByAdmin: one(users, {
    fields: [payments.confirmedByAdminId],
    references: [users.id],
  }),
  evidence: many(paymentEvidence),
  refunds: many(refunds),
}));

export const paymentEvidenceRelations = relations(
  paymentEvidence,
  ({ one }) => ({
    payment: one(payments, {
      fields: [paymentEvidence.paymentId],
      references: [payments.id],
    }),
    uploader: one(users, {
      fields: [paymentEvidence.uploaderId],
      references: [users.id],
    }),
    verifiedByAdmin: one(users, {
      fields: [paymentEvidence.verifiedByAdminId],
      references: [users.id],
    }),
  })
);

export const sellerPayoutsRelations = relations(sellerPayouts, ({ one }) => ({
  order: one(orders, {
    fields: [sellerPayouts.orderId],
    references: [orders.id],
  }),
  seller: one(users, {
    fields: [sellerPayouts.sellerId],
    references: [users.id],
  }),
  processedByAdmin: one(users, {
    fields: [sellerPayouts.processedByAdminId],
    references: [users.id],
  }),
}));

export const refundsRelations = relations(refunds, ({ one }) => ({
  payment: one(payments, {
    fields: [refunds.paymentId],
    references: [payments.id],
  }),
  buyer: one(users, {
    fields: [refunds.buyerId],
    references: [users.id],
  }),
  approvedByAdmin: one(users, {
    fields: [refunds.approvedByAdminId],
    references: [users.id],
  }),
}));

// Logistics Relations
export const deliveriesRelations = relations(deliveries, ({ one, many }) => ({
  order: one(orders, {
    fields: [deliveries.orderId],
    references: [orders.id],
  }),
  exchange: one(exchanges, {
    fields: [deliveries.exchangeId],
    references: [exchanges.id],
  }),
  assignedRep: one(users, {
    fields: [deliveries.assignedRepId],
    references: [users.id],
  }),
  assignments: many(deliveryAssignments),
  pickupLocation: one(locations, {
    fields: [deliveries.pickupLocationId],
    references: [locations.id],
    relationName: "delivery_pickup_location",
  }),
  dropoffLocation: one(locations, {
    fields: [deliveries.dropoffLocationId],
    references: [locations.id],
    relationName: "delivery_dropoff_location",
  }),
  pickupCampus: one(campuses, {
    fields: [deliveries.pickupCampusId],
    references: [campuses.id],
    relationName: "delivery_pickup_campus",
  }),
  dropoffCampus: one(campuses, {
    fields: [deliveries.dropoffCampusId],
    references: [campuses.id],
    relationName: "delivery_dropoff_campus",
  }),
}));

export const deliveryAssignmentsRelations = relations(
  deliveryAssignments,
  ({ one }) => ({
    delivery: one(deliveries, {
      fields: [deliveryAssignments.deliveryId],
      references: [deliveries.id],
    }),
    assignedAgent: one(users, {
      fields: [deliveryAssignments.assignedAgentId],
      references: [users.id],
      relationName: "agent_assignments",
    }),
    assignedByAdmin: one(users, {
      fields: [deliveryAssignments.assignedByAdminId],
      references: [users.id],
    }),
  })
);

// Disputes Relations
export const transactionDisputesRelations = relations(
  transactionDisputes,
  ({ one, many }) => ({
    order: one(orders, {
      fields: [transactionDisputes.orderId],
      references: [orders.id],
    }),
    exchange: one(exchanges, {
      fields: [transactionDisputes.exchangeId],
      references: [exchanges.id],
    }),
    raisedBy: one(users, {
      fields: [transactionDisputes.raisedById],
      references: [users.id],
    }),
    resolvedByAdmin: one(users, {
      fields: [transactionDisputes.resolvedByAdminId],
      references: [users.id],
    }),
    evidence: many(disputeEvidence),
  })
);

export const disputeEvidenceRelations = relations(
  disputeEvidence,
  ({ one }) => ({
    dispute: one(transactionDisputes, {
      fields: [disputeEvidence.disputeId],
      references: [transactionDisputes.id],
    }),
    uploadedBy: one(users, {
      fields: [disputeEvidence.uploadedById],
      references: [users.id],
    }),
  })
);

// Lost & Found Relations
export const lostFoundReportsRelations = relations(
  lostFoundReports,
  ({ one, many }) => ({
    reporter: one(users, {
      fields: [lostFoundReports.reporterId],
      references: [users.id],
    }),
    institution: one(institutions, {
      fields: [lostFoundReports.institutionId],
      references: [institutions.id],
    }),
    campus: one(campuses, {
      fields: [lostFoundReports.campusId],
      references: [campuses.id],
    }),
    location: one(locations, {
      fields: [lostFoundReports.locationId],
      references: [locations.id],
    }),
    images: many(lostFoundImages),
    claims: many(recoveryClaims),
  })
);

export const lostFoundImagesRelations = relations(
  lostFoundImages,
  ({ one }) => ({
    report: one(lostFoundReports, {
      fields: [lostFoundImages.reportId],
      references: [lostFoundReports.id],
    }),
  })
);

export const recoveryClaimsRelations = relations(recoveryClaims, ({ one }) => ({
  report: one(lostFoundReports, {
    fields: [recoveryClaims.reportId],
    references: [lostFoundReports.id],
  }),
  claimant: one(users, {
    fields: [recoveryClaims.claimantId],
    references: [users.id],
  }),
  reviewedByAdmin: one(users, {
    fields: [recoveryClaims.reviewedByAdminId],
    references: [users.id],
  }),
}));

// Audit & Notifications Relations
export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  actor: one(users, {
    fields: [auditLogs.actorId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

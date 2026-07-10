/* Stub auth for the frontend-only replica.
   NextAuth is removed; the app works without a backend. */

export const handlers: any = {
  GET: async () => new Response("ok"),
  POST: async () => new Response("ok"),
};

export const auth: any = async (..._args: any[]) => ({
  user: { id: "demo", name: "Demo Admin", role: "SUPER_ADMIN" },
  expires: new Date(Date.now() + 86400000).toISOString(),
});

export const signIn: any = async () => ({ ok: true });
export const signOut: any = async () => {};

export const GET = handlers.GET;
export const POST = handlers.POST;

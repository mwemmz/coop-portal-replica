/* Mock useSession for the frontend-only replica.
   No next-auth dependency needed at runtime. */

export function useSession() {
  return {
    data: {
      user: { id: "m1", name: "Chanda Banda", role: "MEMBER" },
      expires: new Date(Date.now() + 86400000).toISOString(),
    },
    status: "authenticated",
  };
}

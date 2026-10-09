export const info = {
  applications: {
    pending_ttl_ms:  14 * 24 * 60 * 60 * 1000, // 14 days — undecided applications auto-expire so staff/applicant can re-apply
    approved_ttl_ms: 14 * 24 * 60 * 60 * 1000 // 2 weeks — a minted/approved token not yet used to heartbeat expires; each successful heartbeat slides this window forward, so an actively-running server's token never expires
  }
};

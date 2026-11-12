// Shown in place of a tutor page or panel that an admin has switched off for
// this tutor (see utils/privileges.js).
import React from "react";
import { Card, EmptyState } from "../ui/components";

export default function Locked({ what = "This", title }) {
  return (
    <Card padding={0}>
      <EmptyState icon="lock" title={title || "Not switched on for your account"} body={`${what} is turned off for your account. Ask HSJ admin if you need it.`} />
    </Card>
  );
}

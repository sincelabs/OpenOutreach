import { Button } from "@/components/ui";

import { logout } from "./logout/actions";

export function LogoutButton() {
  return (
    <form action={logout}>
      <Button type="submit" variant="secondary" size="sm">
        Sign out
      </Button>
    </form>
  );
}

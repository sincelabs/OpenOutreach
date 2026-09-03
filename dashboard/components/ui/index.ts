/**
 * The Since Labs component system.
 *
 * One import path, so a consuming app pulls the whole system the same way
 * every time:
 *
 *   import { Button, Panel, StatusChip } from "@/components/ui";
 *
 * Everything exported here is documented in docs/11-components.md, rendered
 * live at /components/, and described as data at /components.json. If a
 * component is not in all four places, it is not part of the system yet.
 *
 * Components that need browser state carry "use client" in their own file, so
 * a server component can import from this barrel without pulling the whole set
 * across the boundary.
 */

// --- Layout and page structure ---------------------------------------------
export { AppShell, type ShellNavItem, type ShellNavSection } from "./AppShell";
export { PageHeader, type Crumb } from "./PageHeader";
export { Breadcrumbs } from "./Breadcrumbs";
export { Card, Panel } from "./Card";
export { Separator } from "./Separator";
export { Eyebrow } from "./Eyebrow";

// --- Actions ----------------------------------------------------------------
export { Button, buttonVariants, type ButtonProps, type ButtonSize, type ButtonVariant } from "./Button";
export { DropdownMenu, type MenuItem } from "./DropdownMenu";
export { CopyButton, CopyField } from "./CopyButton";
export { TextLink } from "./TextLink";

// --- Forms ------------------------------------------------------------------
export { Field, controlClasses, useFieldIds, type FieldIds } from "./Field";
export { Input } from "./Input";
export { Textarea } from "./Textarea";
export { Select } from "./Select";
export { Checkbox, CheckboxGroup } from "./Checkbox";
export { Radio, RadioGroup } from "./Radio";
export { Switch } from "./Switch";

// --- Navigation and views ---------------------------------------------------
export { Tabs, type TabItem } from "./Tabs";
export { SegmentedControl } from "./SegmentedControl";
export { Pagination } from "./Pagination";
export { Disclosure, DisclosureGroup } from "./Disclosure";

// --- Data -------------------------------------------------------------------
export { DataTable, Td, Th, Tr } from "./DataTable";
export { DescriptionList, DescriptionItem } from "./DescriptionList";
export { StatGrid, StatTile } from "./StatTile";
export { EmptyState } from "./EmptyState";

// --- Status and feedback ----------------------------------------------------
export { Alert } from "./Alert";
export { StatusChip, toneForStatus, type StatusTone } from "./StatusChip";
export { Badge, type BadgeTone } from "./Badge";
export { Progress } from "./Progress";
export { Spinner } from "./Spinner";
export { Skeleton, SkeletonText } from "./Skeleton";
export { ToastProvider, ToastCard, useToast, type Toast } from "./Toast";

// --- Overlays ---------------------------------------------------------------
export { Modal, ConfirmDialog } from "./Modal";
export { Drawer } from "./Drawer";
export { Tooltip, InfoTip } from "./Tooltip";

// --- Identity ---------------------------------------------------------------
export { Avatar, initialsFor } from "./Avatar";
export { Icon, ICON_NAMES, type IconName } from "./Icon";
export { ThemeToggle } from "./ThemeToggle";

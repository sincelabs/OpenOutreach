/**
 * The field list, in one place — the dashboard's mirror of `openoutreach/config/models.py`.
 *
 * Every key here is a column on the one `SiteConfig` row (see `lib/db.ts`), and the grouping
 * and copy follow `openoutreach/wizard.py`'s own question order so the dashboard reads as the
 * browser version of the same onboarding, not a second design. **A model change in
 * `config/models.py` (a field added, renamed or resized) has to land here too** — this project
 * owns one schema, and this file is the JS side of describing it.
 */

export type FieldType = "text" | "textarea" | "secret" | "email" | "checkbox";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  hint?: string;
  maxLength?: number;
  placeholder?: string;
}

export interface FieldGroup {
  title: string;
  description?: string;
  fields: FieldDef[];
}

export const GROUPS: FieldGroup[] = [
  {
    title: "What you sell, and to whom",
    description:
      "The whole input: it writes the opening search, trains the qualifier that decides which leads fit, and is what every message is written from.",
    fields: [
      {
        key: "product_docs",
        label: "Product or service",
        type: "textarea",
        hint: "What it does, who it's for, the problem it solves.",
      },
      {
        key: "campaign_target",
        label: "Campaign target",
        type: "textarea",
        hint: "Who you're going after, and the outcome you want.",
      },
      {
        key: "booking_link",
        label: "Booking link",
        type: "text",
        hint: "Optional — the sender renders its booking block only when this is set.",
        maxLength: 500,
      },
    ],
  },
  {
    title: "The model that judges and writes",
    fields: [
      {
        key: "ai_model",
        label: "AI model",
        type: "text",
        hint: "provider:model — e.g. anthropic:claude-sonnet-4-5-20250929, openai:gpt-4o, groq:llama-3.3-70b",
        maxLength: 200,
        placeholder: "anthropic:claude-sonnet-4-5-20250929",
      },
      { key: "llm_api_key", label: "LLM API key", type: "secret", maxLength: 500 },
      {
        key: "llm_api_base",
        label: "LLM API base URL",
        type: "text",
        hint: "Only read by the openai_compatible provider (OpenRouter / Together / Ollama / vLLM).",
        maxLength: 500,
      },
    ],
  },
  {
    title: "Finding people",
    fields: [
      {
        key: "bettercontact_api_key",
        label: "BetterContact API key",
        type: "secret",
        hint: "Powers discovery (free) and email finding (paid).",
        maxLength: 500,
      },
      {
        key: "apollo_api_key",
        label: "Apollo API key",
        type: "secret",
        hint: "Only resolves an address, so it never stands alone.",
        maxLength: 500,
      },
      { key: "email_finder", label: "Email finder", type: "text", maxLength: 32 },
    ],
  },
  {
    title: "The operator",
    description: "Who is running this, and who signs the mail.",
    fields: [
      {
        key: "operator_name",
        label: "Your name",
        type: "text",
        hint: "Signs your mail.",
        maxLength: 200,
      },
      {
        key: "operator_email",
        label: "Your email address",
        type: "email",
        hint: "Where this install's identity is keyed, and where the newsletter goes.",
      },
      {
        key: "country_code",
        label: "Country code",
        type: "text",
        hint: "ISO 3166 alpha-2 (e.g. US, GB, DE) — your own jurisdiction, which decides your email rules.",
        maxLength: 2,
        placeholder: "US",
      },
      {
        key: "accepted_legal_notice",
        label: "I accept the Legal Notice",
        type: "checkbox",
        hint: "See LEGAL_NOTICE.md in the repository.",
      },
      {
        key: "newsletter",
        label: "Subscribe to the OpenOutreach newsletter",
        type: "checkbox",
      },
    ],
  },
  {
    title: "The mailbox this install sends from",
    description:
      "Use an app password, not your login password — Google and most providers reject the latter for SMTP.",
    fields: [
      { key: "mailbox_address", label: "Mailbox address", type: "email" },
      {
        key: "mailbox_password",
        label: "Mailbox app password",
        type: "secret",
        maxLength: 500,
      },
      {
        key: "smtp_host",
        label: "SMTP host",
        type: "text",
        hint: "Blank for Google Workspace.",
        maxLength: 200,
      },
      { key: "smtp_port", label: "SMTP port", type: "text", maxLength: 8 },
      {
        key: "imap_host",
        label: "IMAP host",
        type: "text",
        hint: "Blank for Google Workspace.",
        maxLength: 200,
      },
      { key: "imap_port", label: "IMAP port", type: "text", maxLength: 8 },
      {
        key: "signature",
        label: "Signature",
        type: "textarea",
        hint: "Appended to every message. Blank for none.",
      },
    ],
  },
  {
    title: "The contacts store",
    fields: [
      {
        key: "contacts_api_token",
        label: "Contacts API token",
        type: "secret",
        hint: "Minted by the hub, not typed — leave blank unless you were given one.",
        maxLength: 500,
      },
    ],
  },
];

export const FIELDS: FieldDef[] = GROUPS.flatMap((group) => group.fields);

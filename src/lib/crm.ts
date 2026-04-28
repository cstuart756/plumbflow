/**
 * CRM Abstraction Layer
 * Supports HubSpot, Pipedrive, and Salesforce
 */

interface ContactData {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  properties?: Record<string, any>;
}

interface CRMResponse {
  success: boolean;
  id?: string;
  error?: string;
}

class HubSpotCRM {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.HUBSPOT_API_KEY || "";
  }

  async createContact(data: ContactData): Promise<CRMResponse> {
    if (!this.apiKey) {
      return { success: false, error: "HubSpot API key not configured" };
    }

    try {
      const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          properties: {
            email: data.email,
            firstname: data.firstName,
            lastname: data.lastName,
            phone: data.phone,
            hs_lead_status: "demo_accessed",
            source: "plumbflow_demo",
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HubSpot API error: ${response.statusText}`);
      }

      const result = await response.json();
      return { success: true, id: result.id };
    } catch (error) {
      console.error("[HubSpot Error]", error);
      return { success: false, error: String(error) };
    }
  }
}

class PipedriveCRM {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.PIPEDRIVE_API_KEY || "";
  }

  async createContact(data: ContactData): Promise<CRMResponse> {
    if (!this.apiKey) {
      return { success: false, error: "Pipedrive API key not configured" };
    }

    try {
      const response = await fetch("https://api.pipedrive.com/v1/persons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${data.firstName || ""} ${data.lastName || ""}`.trim(),
          email: data.email,
          phone: data.phone,
          custom_fields: {
            lead_source: "plumbflow_demo",
          },
        }),
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        throw new Error(`Pipedrive API error: ${response.statusText}`);
      }

      const result = await response.json();
      return result.success ? { success: true, id: String(result.data.id) } : { success: false };
    } catch (error) {
      console.error("[Pipedrive Error]", error);
      return { success: false, error: String(error) };
    }
  }
}

class SalesforceC RM {
  private instanceUrl: string;
  private accessToken: string;

  constructor() {
    this.instanceUrl = process.env.SALESFORCE_INSTANCE_URL || "";
    this.accessToken = process.env.SALESFORCE_ACCESS_TOKEN || "";
  }

  async createContact(data: ContactData): Promise<CRMResponse> {
    if (!this.instanceUrl || !this.accessToken) {
      return { success: false, error: "Salesforce credentials not configured" };
    }

    try {
      const response = await fetch(`${this.instanceUrl}/services/data/v59.0/sobjects/Lead`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.accessToken}`,
        },
        body: JSON.stringify({
          FirstName: data.firstName,
          LastName: data.lastName,
          Email: data.email,
          Phone: data.phone,
          LeadSource: "Plumbflow Demo",
          Status: "Open",
        }),
      });

      if (!response.ok) {
        throw new Error(`Salesforce API error: ${response.statusText}`);
      }

      const result = await response.json();
      return { success: true, id: result.id };
    } catch (error) {
      console.error("[Salesforce Error]", error);
      return { success: false, error: String(error) };
    }
  }
}

export function getCRMClient() {
  const crm = process.env.CRM_PROVIDER || "hubspot";

  switch (crm.toLowerCase()) {
    case "pipedrive":
      return new PipedriveCRM();
    case "salesforce":
      return new SalesforceC RM();
    case "hubspot":
    default:
      return new HubSpotCRM();
  }
}

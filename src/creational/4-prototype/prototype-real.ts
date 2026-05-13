type Campaign = {
  channel: "email" | "sms";
  language: "es" | "en";
  tracking: {
    utmSource: string;
    utmCampaign: string;
  };
  content: {
    subject: string;
    body: string;
  };
};

export const blackFridayPrototype: Campaign = {
  channel: "email",
  language: "es",
  tracking: {
    utmSource: "newsletter",
    utmCampaign: "black-friday",
  },
  content: {
    subject: "Oferta especial",
    body: "Aprovecha nuestros descuentos.",
  },
};

export function cloneCampaign(
  prototype: Campaign,
  overrides: {
    subject?: string;
    body?: string;
    utmCampaign?: string;
  },
): Campaign {
  return {
    ...prototype,
    tracking: {
      ...prototype.tracking,
      utmCampaign: overrides.utmCampaign ?? prototype.tracking.utmCampaign,
    },
    content: {
      ...prototype.content,
      subject: overrides.subject ?? prototype.content.subject,
      body: overrides.body ?? prototype.content.body,
    },
  };
}

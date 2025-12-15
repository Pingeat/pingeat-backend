import { Tenant } from "@prisma/client";
import { BotHandler, WhatsAppMessage } from "../../common/BotHandler";
import { IWhatsAppClient } from "../../../infrastructure/whatsapp/WhatsAppClient";
import { ChurchMemberService } from "./ChurchMemberService";

export class ChurchBotService implements BotHandler {
  constructor(
    private readonly waClient: IWhatsAppClient,
    private readonly memberService: ChurchMemberService
  ) {}

  async handleIncomingMessage(
    tenant: Tenant,
    msg: WhatsAppMessage,
    _raw: any
  ): Promise<void> {
    const from = msg.from;
    const type = msg.type;

    if (type !== "text") return;

    const rawText = msg.text?.body ?? "";
    const text = rawText.trim();
    const lower = text.toLowerCase();

    if (lower === "hi" || lower === "new member" || lower === "start") {
      await this.handleNewMemberWelcome(tenant, from);
      return;
    }

    if (lower === "church info" || lower === "about") {
      await this.sendChurchInfo(tenant, from);
      return;
    }

    if (lower.startsWith("register ")) {
      await this.handleRegistration(tenant, from, text.substring("register ".length));
      return;
    }

    if (lower.startsWith("prayer:")) {
      await this.handlePrayerRequest(
        tenant,
        from,
        text.substring("prayer:".length).trim()
      );
      return;
    }

    if (lower === "prayer request") {
      await this.waClient.sendTextMessage(
        from,
        "Please send your request in this format:\n\n*Prayer: your request here*"
      );
      return;
    }

    if (["donation", "offering", "tithe"].includes(lower)) {
      await this.sendDonationInfo(tenant, from);
      return;
    }

    if (lower === "sermon" || lower === "sermon replay") {
      await this.sendSermonInfo(tenant, from);
      return;
    }

    await this.waClient.sendTextMessage(
      from,
      "Welcome to Church on the Rock 🙏\n\n" +
        "Options:\n" +
        "• Type *New member* to register\n" +
        "• Type *Church Info*\n" +
        "• Type *Prayer request*\n" +
        "• Type *Donation*\n" +
        "• Type *Sermon*"
    );
  }

  async handleStatus(
    _tenant: Tenant,
    _status: any,
    _raw: any
  ): Promise<void> {
    return;
  }

  private async handleNewMemberWelcome(
    tenant: Tenant,
    phone: string
  ): Promise<void> {
    await this.memberService.ensureVisitor(tenant.id, phone);
    await this.waClient.sendTextMessage(
      phone,
      "Welcome to Church on the Rock! 🙌\n\n" +
        "To register as a new member, please reply in this format:\n\n" +
        "*Register* FirstName LastName, email@example.com\n\n" +
        "Example:\nRegister John Doe, john@example.com\n\n" +
        "You can also type:\n• *Church Info*\n• *Prayer request*\n• *Donation*\n• *Sermon*"
    );
  }

  private async handleRegistration(
    tenant: Tenant,
    phone: string,
    payload: string
  ): Promise<void> {
    const parts = payload.split(",");
    const namePart = parts[0]?.trim();
    const emailPart = parts[1]?.trim();

    if (!namePart) {
      await this.waClient.sendTextMessage(
        phone,
        "Please provide at least your name.\n\nExample:\nRegister John Doe, john@example.com"
      );
      return;
    }

    const member = await this.memberService.registerMember(
      tenant.id,
      phone,
      namePart,
      emailPart
    );

    await this.waClient.sendTextMessage(
      phone,
      `Thank you, ${member.name ?? "friend"}! 🎉\nYou are now registered.\n\n` +
        "You can type:\n• *Church Info*\n• *Prayer request*\n• *Donation*\n• *Sermon*"
    );
  }

  private async sendChurchInfo(tenant: Tenant, phone: string): Promise<void> {
    const config = (tenant.configJson || {}) as any;
    const history =
      config.churchHistory || "A Bible-believing church in Halifax.";
    const services =
      config.serviceTimings ||
      "Sundays 10:00–11:30 AM\nMidweek: Wednesday 7:00–8:30 PM";
    const ministries =
      config.ministries ||
      "Kids Church, Youth, Young Adults, Couples, Prayer, Missions, Small Groups.";
    const socials =
      config.socials ||
      "Instagram: @churchontherock\nYouTube: Church on the Rock Halifax\nFacebook: Church on the Rock";

    await this.waClient.sendTextMessage(
      phone,
      `📌 *Church Info*\n\n` +
        `*History & Vision*\n${history}\n\n` +
        `*Service Timings*\n${services}\n\n` +
        `*Ministries & Groups*\n${ministries}\n\n` +
        `*Socials*\n${socials}`
    );
  }

  private async handlePrayerRequest(
    tenant: Tenant,
    phone: string,
    content: string
  ): Promise<void> {
    if (!content) {
      await this.waClient.sendTextMessage(
        phone,
        "Please send your request in this format:\n\n*Prayer: your request here*"
      );
      return;
    }

    await this.memberService.logPrayerRequest(tenant.id, phone, content);

    await this.waClient.sendTextMessage(
      phone,
      "🙏 Thank you for sharing your prayer request. Our prayer team will be praying for you."
    );

    const config = (tenant.configJson || {}) as any;
    const pastorNumber: string | undefined = config.pastorPhone;
    if (pastorNumber) {
      await this.waClient.sendTextMessage(
        pastorNumber,
        `📥 New prayer request from ${phone}:\n\n${content}`
      );
    }
  }

  private async sendDonationInfo(
    tenant: Tenant,
    phone: string
  ): Promise<void> {
    const config = (tenant.configJson || {}) as any;
    const eTransfer = config.donation?.eTransfer || "donate@churchontherock.ca";
    const inPerson =
      config.donation?.inPerson ||
      "In-person giving: Sundays 10:00–11:30 AM";
    const bankNote =
      config.donation?.bankNote ||
      "Bank transfer details available on request.";

    await this.waClient.sendTextMessage(
      phone,
      "💒 *Donations & Offerings*\n\n" +
        `• e-Transfer: ${eTransfer}\n` +
        `• In-person: ${inPerson}\n` +
        `• Bank Transfer: ${bankNote}\n\n` +
        "Reply with your email if you need a tax receipt."
    );
  }

  private async sendSermonInfo(
    tenant: Tenant,
    phone: string
  ): Promise<void> {
    const config = (tenant.configJson || {}) as any;
    const latestTitle =
      config.sermon?.latestTitle || "Latest Sunday Sermon";
    const latestLink = config.sermon?.latestLink || "https://youtube.com/";
    await this.waClient.sendTextMessage(
      phone,
      `🎥 Missed Sunday? Watch: *${latestTitle}*\n${latestLink}`
    );
  }
}

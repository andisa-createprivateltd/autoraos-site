import '../../domain/models/booking.dart';
import '../../domain/models/conversation.dart';
import '../../domain/models/dealer_role.dart';
import '../../domain/models/lead.dart';
import '../../domain/models/settings.dart';
import '../../domain/models/user_profile.dart';

class MockSeedData {
  static const String dealerId = '4d17fc5f-0638-4f15-95bf-95f1f40bf1ab';
  static const String adminId = '6db89242-6d38-4f8f-8c75-c26f77d5275c';
  static const String salesId = 'f6acdc19-78f3-45ac-baa6-b17366db75f0';

  static UserProfile get userProfile {
    return UserProfile(
      id: adminId,
      dealerId: dealerId,
      name: 'Dealer Admin',
      email: 'admin@createprivate.co',
      role: DealerRole.dealerAdmin,
      isActive: true,
      lastLoginAt: DateTime.now().toUtc(),
    );
  }

  static List<Lead> leads() {
    return <Lead>[
      Lead(
        id: '4c8a2075-4cce-4f4d-a68e-a5150b7a4f5f',
        dealerId: dealerId,
        source: LeadSource.whatsapp,
        firstContactAt: DateTime.now().toUtc().subtract(const Duration(hours: 2)),
        name: 'Lerato Molefe',
        phone: '+27820001111',
        vehicleInterest: 'Jaecoo J7',
        budgetRange: 'R500k-R700k',
        status: LeadStatus.contacted,
        assignedUserId: salesId,
        lastActivityAt: DateTime.now().toUtc().subtract(const Duration(minutes: 16)),
        createdAt: DateTime.now().toUtc().subtract(const Duration(hours: 5)),
      ),
      Lead(
        id: '3f3904b0-ec17-410f-8e64-d6644ea89dd8',
        dealerId: dealerId,
        source: LeadSource.website,
        firstContactAt: DateTime.now().toUtc().subtract(const Duration(hours: 8)),
        name: 'Neo Dlamini',
        phone: '+27820002222',
        vehicleInterest: 'Haval H6',
        budgetRange: 'R450k-R600k',
        status: LeadStatus.newLead,
        assignedUserId: salesId,
        lastActivityAt: DateTime.now().toUtc().subtract(const Duration(hours: 1)),
        createdAt: DateTime.now().toUtc().subtract(const Duration(hours: 12)),
      ),
    ];
  }

  static List<Conversation> conversations(List<Lead> leads) {
    return <Conversation>[
      Conversation(
        id: '7cfca36c-54b6-4f96-90f6-3f8e89ec9cb3',
        dealerId: dealerId,
        leadId: leads[0].id,
        channel: 'whatsapp',
        isOpen: true,
        lastMessageAt: DateTime.now().toUtc().subtract(const Duration(minutes: 16)),
        createdAt: DateTime.now().toUtc().subtract(const Duration(hours: 2)),
        lead: leads[0],
        lastMessagePreview: 'Can I test drive on Saturday?',
      ),
      Conversation(
        id: 'e5dc1850-f4d8-4759-a5f8-1b9e4d7712f9',
        dealerId: dealerId,
        leadId: leads[1].id,
        channel: 'whatsapp',
        isOpen: true,
        lastMessageAt: DateTime.now().toUtc().subtract(const Duration(hours: 2)),
        createdAt: DateTime.now().toUtc().subtract(const Duration(hours: 4)),
        lead: leads[1],
        lastMessagePreview: 'What are your finance options?',
      ),
    ];
  }

  static Map<String, List<Message>> messages(List<Conversation> conversations, List<Lead> leads) {
    return <String, List<Message>>{
      conversations[0].id: <Message>[
        Message(
          id: 'd7f2d5a6-9fb1-4ed4-8fa8-e7e8f6151001',
          dealerId: dealerId,
          conversationId: conversations[0].id,
          leadId: leads[0].id,
          direction: MessageDirection.inbound,
          senderType: MessageSenderType.lead,
          senderUserId: null,
          content: 'Can I test drive on Saturday?',
          messageType: MessageType.text,
          providerMessageId: null,
          createdAt: DateTime.now().toUtc().subtract(const Duration(minutes: 18)),
        ),
        Message(
          id: 'd7f2d5a6-9fb1-4ed4-8fa8-e7e8f6151002',
          dealerId: dealerId,
          conversationId: conversations[0].id,
          leadId: leads[0].id,
          direction: MessageDirection.outbound,
          senderType: MessageSenderType.human,
          senderUserId: salesId,
          content: 'Yes, 10:00 works. I can book it now.',
          messageType: MessageType.text,
          providerMessageId: null,
          createdAt: DateTime.now().toUtc().subtract(const Duration(minutes: 16)),
        ),
      ],
      conversations[1].id: <Message>[
        Message(
          id: 'd7f2d5a6-9fb1-4ed4-8fa8-e7e8f6151003',
          dealerId: dealerId,
          conversationId: conversations[1].id,
          leadId: leads[1].id,
          direction: MessageDirection.inbound,
          senderType: MessageSenderType.lead,
          senderUserId: null,
          content: 'What are your finance options?',
          messageType: MessageType.text,
          providerMessageId: null,
          createdAt: DateTime.now().toUtc().subtract(const Duration(hours: 2)),
        ),
      ],
    };
  }

  static List<Booking> bookings(List<Lead> leads) {
    return <Booking>[
      Booking(
        id: 'a2df2fec-c6ba-4f3b-8583-8f09c9ff9130',
        dealerId: dealerId,
        leadId: leads[0].id,
        type: BookingType.testDrive,
        requestedAt: DateTime.now().toUtc().subtract(const Duration(hours: 1)),
        scheduledFor: DateTime.now().toUtc().add(const Duration(days: 1)),
        status: BookingStatus.booked,
        createdBy: 'human',
        createdAt: DateTime.now().toUtc().subtract(const Duration(hours: 1)),
        lead: leads[0],
      ),
    ];
  }

  static List<TeamMember> team() {
    return <TeamMember>[
      TeamMember(
        id: adminId,
        dealerId: dealerId,
        name: 'Dealer Admin',
        email: 'admin@createprivate.co',
        role: DealerRole.dealerAdmin,
        isActive: true,
        createdAt: DateTime.now().toUtc().subtract(const Duration(days: 30)),
      ),
      TeamMember(
        id: salesId,
        dealerId: dealerId,
        name: 'Sales Specialist',
        email: 'sales@createprivate.co',
        role: DealerRole.dealerSales,
        isActive: true,
        createdAt: DateTime.now().toUtc().subtract(const Duration(days: 24)),
      ),
    ];
  }

  static DealerSettings settings() {
    return DealerSettings(
      businessHours: <String, BusinessHoursDay>{
        'mon': const BusinessHoursDay(open: '08:00', close: '17:00'),
        'tue': const BusinessHoursDay(open: '08:00', close: '17:00'),
        'wed': const BusinessHoursDay(open: '08:00', close: '17:00'),
        'thu': const BusinessHoursDay(open: '08:00', close: '17:00'),
        'fri': const BusinessHoursDay(open: '08:00', close: '17:00'),
      },
      faqs: const <String>[
        'Do you offer test drives?',
        'Can I apply for finance online?',
      ],
      marketingCanViewMessages: false,
      allowAdminFullPhone: true,
    );
  }
}

// Demo/Mock data for testing without Supabase

import '../models/app_session.dart';
import '../models/user_profile.dart';

final demoDealerAdminSession = AppSession(
  accessToken: 'demo_token_admin_12345',
  refreshToken: 'demo_refresh_admin_12345',
  expiresAt: DateTime.now().add(Duration(days: 7)),
  userProfile: UserProfile(
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'admin@dealer.com',
    name: 'John Administrator',
    dealerID: 'dealer_001',
    role: DealerRole.dealerAdmin,
    phoneNumber: '555-123-4567',
    avatarUrl: null,
  ),
);

final demoSalesRepSession = AppSession(
  accessToken: 'demo_token_sales_12345',
  refreshToken: 'demo_refresh_sales_12345',
  expiresAt: DateTime.now().add(Duration(days: 7)),
  userProfile: UserProfile(
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: 'sales@dealer.com',
    name: 'Jane SalesRep',
    dealerID: 'dealer_001',
    role: DealerRole.salesRep,
    phoneNumber: '555-234-5678',
    avatarUrl: null,
  ),
);

final demoMarketingRepSession = AppSession(
  accessToken: 'demo_token_marketing_12345',
  refreshToken: 'demo_refresh_marketing_12345',
  expiresAt: DateTime.now().add(Duration(days: 7)),
  userProfile: UserProfile(
    id: '550e8400-e29b-41d4-a716-446655440002',
    email: 'marketing@dealer.com',
    name: 'Mike Marketing',
    dealerID: 'dealer_001',
    role: DealerRole.marketingRep,
    phoneNumber: '555-345-6789',
    avatarUrl: null,
  ),
);

// Demo credentials for testing
Map<String, Map<String, dynamic>> demoCredentials = {
  'admin@dealer.com': {'password': 'password123', 'session': demoDealerAdminSession},
  'sales@dealer.com': {'password': 'password123', 'session': demoSalesRepSession},
  'marketing@dealer.com': {'password': 'password123', 'session': demoMarketingRepSession},
};

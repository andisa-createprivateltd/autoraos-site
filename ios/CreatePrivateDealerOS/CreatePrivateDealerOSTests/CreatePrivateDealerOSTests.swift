import XCTest
@testable import CreatePrivateDealerOS

final class CreatePrivateDealerOSTests: XCTestCase {
    func testPhoneMasking() {
        XCTAssertEqual(PhoneMasker.mask("+27820001111", revealFull: false), "***-***-1111")
        XCTAssertEqual(PhoneMasker.mask("+27820001111", revealFull: true), "+27820001111")
    }

    func testMarketingCannotViewMessagesByDefault() {
        XCTAssertFalse(DealerRole.dealerMarketing.canViewMessageContent(marketingFeatureFlag: false))
        XCTAssertTrue(DealerRole.dealerMarketing.canViewMessageContent(marketingFeatureFlag: true))
    }
}

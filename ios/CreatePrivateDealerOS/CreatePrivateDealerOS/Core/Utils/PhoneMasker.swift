import Foundation

enum PhoneMasker {
    static func mask(_ phone: String, revealFull: Bool) -> String {
        if revealFull {
            return phone
        }

        let digits = phone.filter(\.isNumber)
        guard digits.count >= 4 else {
            return "****"
        }

        let suffix = String(digits.suffix(4))
        return "***-***-\(suffix)"
    }
}

import SwiftUI

struct LoadingStateView: View {
    var body: some View {
        VStack(spacing: 12) {
            ProgressView()
            Text("Loading...")
                .font(.footnote)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

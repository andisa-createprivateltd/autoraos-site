import SwiftUI

struct LoginView: View {
    @EnvironmentObject private var appViewModel: AppViewModel

    @State private var email = ""
    @State private var password = ""

    var body: some View {
        NavigationStack {
            VStack(spacing: 16) {
                Spacer()

                Text("CreatePrivate Dealer OS")
                    .font(.title.bold())
                Text("BETA")
                    .font(.caption)
                    .foregroundStyle(.secondary)

                TextField("Email", text: $email)
                    .textInputAutocapitalization(.never)
                    .keyboardType(.emailAddress)
                    .autocorrectionDisabled()
                    .textFieldStyle(.roundedBorder)

                SecureField("Password", text: $password)
                    .textFieldStyle(.roundedBorder)

                Button {
                    Task {
                        await appViewModel.signIn(email: email, password: password)
                    }
                } label: {
                    if appViewModel.isSigningIn {
                        ProgressView()
                            .frame(maxWidth: .infinity)
                    } else {
                        Text("Sign In")
                            .frame(maxWidth: .infinity)
                    }
                }
                .buttonStyle(.borderedProminent)
                .disabled(email.isEmpty || password.isEmpty || appViewModel.isSigningIn)

                Button("Forgot Password") {
                    Task {
                        await appViewModel.resetPassword(email: email)
                    }
                }
                .buttonStyle(.bordered)

                if let message = appViewModel.errorMessage {
                    ErrorBanner(message: message)
                }

                Spacer()
            }
            .padding()
            .navigationBarHidden(true)
        }
    }
}

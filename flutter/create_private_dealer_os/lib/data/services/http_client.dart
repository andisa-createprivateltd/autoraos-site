import 'dart:convert';

import 'package:http/http.dart' as http;

import '../../core/errors/app_exception.dart';

class HttpClient {
  HttpClient({http.Client? inner}) : _inner = inner ?? http.Client();

  final http.Client _inner;

  Future<dynamic> getJson({
    required Uri uri,
    required Map<String, String> headers,
  }) async {
    final http.Response response = await _inner.get(uri, headers: headers);
    return _parseJson(response);
  }

  Future<dynamic> postJson({
    required Uri uri,
    required Map<String, String> headers,
    required Object body,
  }) async {
    final http.Response response = await _inner.post(
      uri,
      headers: headers,
      body: jsonEncode(body),
    );
    return _parseJson(response);
  }

  Future<dynamic> patchJson({
    required Uri uri,
    required Map<String, String> headers,
    required Object body,
  }) async {
    final http.Response response = await _inner.patch(
      uri,
      headers: headers,
      body: jsonEncode(body),
    );
    return _parseJson(response);
  }

  Future<void> postEmpty({
    required Uri uri,
    required Map<String, String> headers,
    required Object body,
  }) async {
    final http.Response response = await _inner.post(
      uri,
      headers: headers,
      body: jsonEncode(body),
    );
    _ensureSuccess(response);
  }

  Future<void> patchEmpty({
    required Uri uri,
    required Map<String, String> headers,
    required Object body,
  }) async {
    final http.Response response = await _inner.patch(
      uri,
      headers: headers,
      body: jsonEncode(body),
    );
    _ensureSuccess(response);
  }

  dynamic _parseJson(http.Response response) {
    _ensureSuccess(response);

    if (response.body.isEmpty) {
      return null;
    }

    return jsonDecode(response.body);
  }

  void _ensureSuccess(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return;
    }

    if (response.statusCode == 401) {
      throw AppException.unauthorized();
    }

    if (response.statusCode == 403) {
      throw AppException.forbidden();
    }

    throw AppException(
      'HTTP ${response.statusCode}: ${response.body}',
      code: response.statusCode,
    );
  }
}

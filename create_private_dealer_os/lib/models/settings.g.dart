// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'settings.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$DealerSettingsImpl _$$DealerSettingsImplFromJson(Map<String, dynamic> json) =>
    _$DealerSettingsImpl(
      businessHours: (json['businessHours'] as Map<String, dynamic>).map(
        (k, e) =>
            MapEntry(k, BusinessHours.fromJson(e as Map<String, dynamic>)),
      ),
      faqs: (json['faqs'] as List<dynamic>)
          .map((e) => FAQ.fromJson(e as Map<String, dynamic>))
          .toList(),
      marketingCanViewMessages: json['marketingCanViewMessages'] as bool,
      allowAdminFullPhone: json['allowAdminFullPhone'] as bool,
    );

Map<String, dynamic> _$$DealerSettingsImplToJson(
  _$DealerSettingsImpl instance,
) => <String, dynamic>{
  'businessHours': instance.businessHours,
  'faqs': instance.faqs,
  'marketingCanViewMessages': instance.marketingCanViewMessages,
  'allowAdminFullPhone': instance.allowAdminFullPhone,
};

_$BusinessHoursImpl _$$BusinessHoursImplFromJson(Map<String, dynamic> json) =>
    _$BusinessHoursImpl(
      open: json['open'] as String,
      close: json['close'] as String,
    );

Map<String, dynamic> _$$BusinessHoursImplToJson(_$BusinessHoursImpl instance) =>
    <String, dynamic>{'open': instance.open, 'close': instance.close};

_$FAQImpl _$$FAQImplFromJson(Map<String, dynamic> json) => _$FAQImpl(
  id: json['id'] as String,
  question: json['question'] as String,
  answer: json['answer'] as String,
);

Map<String, dynamic> _$$FAQImplToJson(_$FAQImpl instance) => <String, dynamic>{
  'id': instance.id,
  'question': instance.question,
  'answer': instance.answer,
};

_$TeamMemberImpl _$$TeamMemberImplFromJson(Map<String, dynamic> json) =>
    _$TeamMemberImpl(
      id: json['id'] as String,
      name: json['name'] as String,
      email: json['email'] as String,
      role: json['role'] as String,
      isActive: json['isActive'] as bool?,
    );

Map<String, dynamic> _$$TeamMemberImplToJson(_$TeamMemberImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'email': instance.email,
      'role': instance.role,
      'isActive': instance.isActive,
    };

_$InviteUserRequestImpl _$$InviteUserRequestImplFromJson(
  Map<String, dynamic> json,
) => _$InviteUserRequestImpl(
  email: json['email'] as String,
  role: json['role'] as String,
);

Map<String, dynamic> _$$InviteUserRequestImplToJson(
  _$InviteUserRequestImpl instance,
) => <String, dynamic>{'email': instance.email, 'role': instance.role};

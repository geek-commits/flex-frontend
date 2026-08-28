<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted' => 'Sehemu ya :attribute lazima ikubaliwe.',
    'accepted_if' => 'Sehemu ya :attribute lazima ikubaliwe wakati :other ni :value.',
    'active_url' => 'Sehemu ya :attribute lazima iwe URL halali.',
    'after' => 'Sehemu ya :attribute lazima iwe tarehe baada ya :date.',
    'after_or_equal' => 'Sehemu ya :attribute lazima iwe tarehe baada au sawa na :date.',
    'alpha' => 'Sehemu ya :attribute lazima iwe na herufi pekee.',
    'alpha_dash' => 'Sehemu ya :attribute lazima iwe na herufi, nambari, deshi na mistari ya chini pekee.',
    'alpha_num' => 'Sehemu ya :attribute lazima iwe na herufi na nambari pekee.',
    'any_of' => 'Sehemu ya :attribute si sahihi.',
    'array' => 'Sehemu ya :attribute lazima iwe safu.',
    'array_keys' => 'Sehemu ya :attribute lazima iwe na funguo zifuatazo: :values.',
    'ascii' => 'Sehemu ya :attribute lazima iwe na herufi na alama za baiti moja pekee.',
    'base64' => 'Sehemu ya :attribute lazima iwe mfuatano halali wa Base64.',
    'before' => 'Sehemu ya :attribute lazima iwe tarehe kabla ya :date.',
    'before_or_equal' => 'Sehemu ya :attribute lazima iwe tarehe kabla au sawa na :date.',
    'between' => [
        'array' => 'Sehemu ya :attribute lazima iwe na kati ya :min na :max vipengele.',
        'file' => 'Sehemu ya :attribute lazima iwe faili.',
        'numeric' => 'Sehemu ya :attribute lazima iwe nambari.',
        'string' => 'Sehemu ya :attribute lazima iwe mfuatano wa herufi.',
    ],
    'boolean' => 'Sehemu ya :attribute lazima iwe kweli au uwongo.',
    'can' => 'Sehemu ya :attribute ina thamani isiyoidhinishwa.',
    'confirmed' => 'Uthibitisho wa sehemu ya :attribute haulingani.',
    'contains' => 'Sehemu ya :attribute inakosa thamani inayohitajika.',
    'current_password' => 'Nenosiri si sahihi.',
    'date' => 'Sehemu ya :attribute lazima iwe tarehe halali.',
    'date_equals' => 'Sehemu ya :attribute lazima iwe tarehe sawa na :date.',
    'date_format' => 'Sehemu ya :attribute lazima ilingane na muundo :format.',
    'decimal' => 'Sehemu ya :attribute lazima iwe na sehemu :decimal za desimali.',
    'declined' => 'Sehemu ya :attribute lazima ikataliwe.',
    'declined_if' => 'Sehemu ya :attribute lazima ikataliwe wakati :other ni :value.',
    'different' => 'Sehemu ya :attribute na :other lazima ziwe tofauti.',
    'digits' => 'Sehemu ya :attribute lazima iwe tarakimu :digits.',
    'digits_between' => 'Sehemu ya :attribute lazima iwe kati ya :min na :max tarakimu.',
    'dimensions' => 'Sehemu ya :attribute ina vipimo batili vya picha.',
    'distinct' => 'Sehemu ya :attribute ina thamani rudufu.',
    'doesnt_contain' => 'The :attribute field must not contain any of the following: :values.',
    'doesnt_end_with' => 'The :attribute field must not end with one of the following: :values.',
    'doesnt_start_with' => 'The :attribute field must not start with one of the following: :values.',
    'email' => 'Sehemu ya :attribute lazima iwe barua pepe sahihi.',
    'encoding' => 'The :attribute field must be encoded in :encoding.',
    'ends_with' => 'The :attribute field must end with one of the following: :values.',
    'enum' => 'The selected :attribute is invalid.',
    'exists' => 'Sehemu ya :attribute iliyochaguliwa si sahihi.',
    'extensions' => 'The :attribute field must have one of the following extensions: :values.',
    'file' => 'The :attribute field must be a file.',
    'filled' => 'Sehemu ya :attribute lazima iwe na thamani.',
    'gt' => [
        'array' => 'Sehemu ya :attribute lazima iwe na zaidi ya vipengele :value.',
        'file' => 'Sehemu ya :attribute lazima iwe kubwa kuliko kilobaiti :value.',
        'numeric' => 'Sehemu ya :attribute lazima iwe kubwa kuliko :value.',
        'string' => 'Sehemu ya :attribute lazima iwe na zaidi ya herufi :value.',
    ],
    'gte' => [
        'array' => 'Sehemu ya :attribute lazima iwe na vipengele :value au zaidi.',
        'file' => 'Sehemu ya :attribute lazima iwe kubwa kuliko au sawa na kilobaiti :value.',
        'numeric' => 'Sehemu ya :attribute lazima iwe kubwa kuliko au sawa na :value.',
        'string' => 'Sehemu ya :attribute lazima iwe na herufi :value au zaidi.',
    ],
    'hex_color' => 'The :attribute field must be a valid hexadecimal color.',
    'image' => 'Sehemu ya :attribute lazima iwe picha.',
    'in' => 'Sehemu ya :attribute iliyochaguliwa si sahihi.',
    'in_array' => 'The :attribute field must exist in :other.',
    'in_array_keys' => 'The :attribute field must contain at least one of the following keys: :values.',
    'integer' => 'Sehemu ya :attribute lazima iwe nambari kamili.',
    'ip' => 'Sehemu ya :attribute lazima iwe anwani halali ya IP.',
    'ipv4' => 'The :attribute field must be a valid IPv4 address.',
    'ipv6' => 'The :attribute field must be a valid IPv6 address.',
    'json' => 'Sehemu ya :attribute lazima iwe mfuatano halali wa JSON.',
    'list' => 'The :attribute field must be a list.',
    'lowercase' => 'The :attribute field must be lowercase.',
    'lt' => [
        'array' => 'Sehemu ya :attribute lazima iwe na chini ya vipengele :value.',
        'file' => 'Sehemu ya :attribute lazima iwe chini ya kilobaiti :value.',
        'numeric' => 'Sehemu ya :attribute lazima iwe chini ya :value.',
        'string' => 'Sehemu ya :attribute lazima iwe na chini ya herufi :value.',
    ],
    'lte' => [
        'array' => 'Sehemu ya :attribute lazima isizidi vipengele :value.',
        'file' => 'Sehemu ya :attribute lazima iwe chini ya au sawa na kilobaiti :value.',
        'numeric' => 'Sehemu ya :attribute lazima iwe chini ya au sawa na :value.',
        'string' => 'Sehemu ya :attribute lazima isizidi herufi :value.',
    ],
    'mac_address' => 'The :attribute field must be a valid MAC address.',
    'max' => [
        'array' => 'Sehemu ya :attribute lazima isizidi vipengele :max.',
        'file' => 'Sehemu ya :attribute lazima isizidi kilobaiti :max.',
        'numeric' => 'Sehemu ya :attribute lazima isizidi :max.',
        'string' => 'Sehemu ya :attribute lazima isizidi herufi :max.',
    ],
    'max_digits' => 'The :attribute field must not have more than :max digits.',
    'mimes' => 'The :attribute field must be a file of type: :values.',
    'mimetypes' => 'The :attribute field must be a file of type: :values.',
    'min' => [
        'array' => 'Sehemu ya :attribute lazima iwe na angalau vipengele :min.',
        'file' => 'Sehemu ya :attribute lazima iwe angalau kilobaiti :min.',
        'numeric' => 'Sehemu ya :attribute lazima iwe angalau :min.',
        'string' => 'Sehemu ya :attribute lazima iwe na angalau herufi :min.',
    ],
    'min_digits' => 'The :attribute field must have at least :min digits.',
    'missing' => 'The :attribute field must be missing.',
    'missing_if' => 'The :attribute field must be missing when :other is :value.',
    'missing_unless' => 'The :attribute field must be missing unless :other is :value.',
    'missing_with' => 'The :attribute field must be missing when :values is present.',
    'missing_with_all' => 'The :attribute field must be missing when :values are present.',
    'multiple_of' => 'The :attribute field must be a multiple of :value.',
    'not_in' => 'The selected :attribute is invalid.',
    'not_regex' => 'The :attribute field format is invalid.',
    'numeric' => 'Sehemu ya :attribute lazima iwe nambari.',
    'password' => [
        'letters' => 'Sehemu ya :attribute lazima iwe na angalau herufi moja.',
        'mixed' => 'Sehemu ya :attribute lazima iwe na angalau herufi kubwa moja na ndogo moja.',
        'numbers' => 'Sehemu ya :attribute lazima iwe na angalau nambari moja.',
        'symbols' => 'Sehemu ya :attribute lazima iwe na angalau alama moja.',
        'uncompromised' => 'Sehemu ya :attribute iliyotolewa imeonekana katika uvujishaji wa data. Tafadhali chagua :attribute tofauti.',
    ],
    'present' => 'Sehemu ya :attribute lazima iwepo.',
    'present_if' => 'The :attribute field must be present when :other is :value.',
    'present_unless' => 'The :attribute field must be present unless :other is :value.',
    'present_with' => 'The :attribute field must be present when :values is present.',
    'present_with_all' => 'The :attribute field must be present when :values are present.',
    'prohibited' => 'The :attribute field is prohibited.',
    'prohibited_if' => 'The :attribute field is prohibited when :other is :value.',
    'prohibited_if_accepted' => 'The :attribute field is prohibited when :other is accepted.',
    'prohibited_if_declined' => 'The :attribute field is prohibited when :other is declined.',
    'prohibited_unless' => 'The :attribute field is prohibited unless :other is in :values.',
    'prohibits' => 'The :attribute field prohibits :other from being present.',
    'regex' => 'Muundo wa sehemu ya :attribute si sahihi.',
    'required' => 'Sehemu ya :attribute inahitajika.',
    'required_array_keys' => 'The :attribute field must contain entries for: :values.',
    'required_if' => 'The :attribute field is required when :other is :value.',
    'required_if_accepted' => 'The :attribute field is required when :other is accepted.',
    'required_if_declined' => 'The :attribute field is required when :other is declined.',
    'required_unless' => 'The :attribute field is required unless :other is in :values.',
    'required_with' => 'The :attribute field is required when :values is present.',
    'required_with_all' => 'The :attribute field is required when :values are present.',
    'required_without' => 'The :attribute field is required when :values is not present.',
    'required_without_all' => 'The :attribute field is required when none of :values are present.',
    'same' => 'Sehemu ya :attribute lazima ilingane na :other.',
    'size' => [
        'array' => 'Sehemu ya :attribute lazima iwe na vipengele :size.',
        'file' => 'Sehemu ya :attribute lazima iwe kilobaiti :size.',
        'numeric' => 'Sehemu ya :attribute lazima iwe :size.',
        'string' => 'Sehemu ya :attribute lazima iwe herufi :size.',
    ],
    'starts_with' => 'The :attribute field must start with one of the following: :values.',
    'string' => 'Sehemu ya :attribute lazima iwe mfuatano wa herufi.',
    'timezone' => 'The :attribute field must be a valid timezone.',
    'unique' => 'Sehemu ya :attribute tayari imetumika.',
    'uploaded' => 'The :attribute failed to upload.',
    'uppercase' => 'The :attribute field must be uppercase.',
    'url' => 'Sehemu ya :attribute lazima iwe URL halali.',
    'ulid' => 'The :attribute field must be a valid ULID.',
    'uuid' => 'Sehemu ya :attribute lazima iwe UUID halali.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap our attribute placeholder
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email". This simply helps us make our message more expressive.
    |
    */

    'attributes' => [],

];

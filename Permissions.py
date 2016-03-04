
class Permissions:
    """System permissions object with permissions and groups."""

    def get_permissions(self):
        return dict({
            "calendar": ['READ_CALENDAR',
                        'WRITE_CALENDAR'],
            "camera":	['CONTACTS', 'CAMERA'],
            "contacts":	['READ_CONTACTS', 'WRITE_CONTACTS', 'GET_ACCOUNTS'],
            "location": ['ACCESS_FINE_LOCATION', 'ACCESS_COARSE_LOCATION'],
            "microphone": ['RECORD_AUDIO'],
            "phone":     ['READ_PHONE_STATE', 'CALL_PHONE',
                        'READ_CALL_LOG', 'WRITE_CALL_LOG', 'ADD_VOICEMAIL',
                        'USE_SIP', 'PROCESS_OUTGOING_CALLS'],
            "sensors": ['BODY_SENSORS'],
            "sms": ['SEND_SMS', 'RECEIVE_SMS', 'READ_SMS',
                    'RECEIVE_WAP_PUSH','RECEIVE_MMS'],
            "storage": ['READ_EXTERNAL_STORAGE', 'WRITE_EXTERNAL_STORAGE']
        })

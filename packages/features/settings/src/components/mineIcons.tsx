import React from 'react';
import {StyleSheet, View} from 'react-native';

interface IconProps {
  color: string;
  size?: number;
}

export type MineIconName =
  | 'info_outline'
  | 'event_available_outlined'
  | 'settings_outlined'
  | 'logout_rounded'
  | 'login_rounded'
  | 'arrow_back_ios_new'
  | 'keyboard_arrow_down'
  | 'badge_outlined'
  | 'verified'
  | 'person'
  | 'close'
  | 'photo_library_outlined'
  | 'camera_alt_outlined'
  | 'chevron_right_rounded'
  | 'check_rounded'
  | 'refresh_rounded'
  | 'sync_rounded'
  | 'check_circle_rounded'
  | 'error_outline_rounded'
  | 'cloud_off_rounded'
  | 'hub_rounded'
  | 'folder_outlined'
  | 'person_outline_rounded'
  | 'schedule_rounded'
  | 'link_rounded';

function InfoOutlineIcon({color, size = 22}: IconProps) {
  const scale = size / 22;
  const ring = 18 * scale;
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={{
          width: ring,
          height: ring,
          borderRadius: ring / 2,
          borderWidth: 1.5 * scale,
          borderColor: color,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: 2 * scale,
            height: 2 * scale,
            borderRadius: scale,
            backgroundColor: color,
            marginBottom: 2 * scale,
          }}
        />
        <View
          style={{
            width: 2 * scale,
            height: 7 * scale,
            borderRadius: scale,
            backgroundColor: color,
          }}
        />
      </View>
    </View>
  );
}

function EventAvailableIcon({color, size = 22}: IconProps) {
  const scale = size / 22;
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={{
          width: 18 * scale,
          height: 16 * scale,
          borderWidth: 1.5 * scale,
          borderColor: color,
          borderRadius: 2 * scale,
        }}>
        <View
          style={{
            position: 'absolute',
            top: 4 * scale,
            left: 3 * scale,
            width: 10 * scale,
            height: 6 * scale,
            borderLeftWidth: 1.5 * scale,
            borderBottomWidth: 1.5 * scale,
            borderColor: color,
            transform: [{rotate: '-45deg'}],
          }}
        />
      </View>
    </View>
  );
}

function SettingsOutlineIcon({color, size = 22}: IconProps) {
  const scale = size / 22;
  const core = 8 * scale;
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={{
          width: core,
          height: core,
          borderRadius: core / 2,
          borderWidth: 1.5 * scale,
          borderColor: color,
        }}
      />
      {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
        <View
          key={deg}
          style={{
            position: 'absolute',
            width: 2 * scale,
            height: 5 * scale,
            backgroundColor: color,
            borderRadius: scale,
            transform: [{rotate: `${deg}deg`}, {translateY: -9 * scale}],
          }}
        />
      ))}
    </View>
  );
}

function LogoutIcon({color, size = 22}: IconProps) {
  const scale = size / 22;
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={{
          width: 10 * scale,
          height: 14 * scale,
          borderWidth: 1.5 * scale,
          borderColor: color,
          borderRightWidth: 0,
          borderTopLeftRadius: 2 * scale,
          borderBottomLeftRadius: 2 * scale,
        }}
      />
      <View
        style={{
          position: 'absolute',
          right: 2 * scale,
          width: 8 * scale,
          height: 1.5 * scale,
          backgroundColor: color,
        }}
      />
      <View
        style={{
          position: 'absolute',
          right: 2 * scale,
          width: 0,
          height: 0,
          borderTopWidth: 3 * scale,
          borderBottomWidth: 3 * scale,
          borderLeftWidth: 4 * scale,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          borderLeftColor: color,
        }}
      />
    </View>
  );
}

function LoginIcon({color, size = 22}: IconProps) {
  const scale = size / 22;
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={{
          width: 10 * scale,
          height: 14 * scale,
          borderWidth: 1.5 * scale,
          borderColor: color,
          borderLeftWidth: 0,
          borderTopRightRadius: 2 * scale,
          borderBottomRightRadius: 2 * scale,
          marginLeft: 8 * scale,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: 2 * scale,
          width: 8 * scale,
          height: 1.5 * scale,
          backgroundColor: color,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: 2 * scale,
          width: 0,
          height: 0,
          borderTopWidth: 3 * scale,
          borderBottomWidth: 3 * scale,
          borderRightWidth: 4 * scale,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          borderRightColor: color,
        }}
      />
    </View>
  );
}

function ArrowBackIcon({color, size = 20}: IconProps) {
  const scale = size / 20;
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={{
          width: 10 * scale,
          height: 10 * scale,
          borderLeftWidth: 2 * scale,
          borderBottomWidth: 2 * scale,
          borderColor: color,
          transform: [{rotate: '45deg'}],
          marginLeft: 4 * scale,
        }}
      />
    </View>
  );
}

function KeyboardArrowDownIcon({color, size = 18}: IconProps) {
  const scale = size / 18;
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={{
          width: 8 * scale,
          height: 8 * scale,
          borderRightWidth: 2 * scale,
          borderBottomWidth: 2 * scale,
          borderColor: color,
          transform: [{rotate: '45deg'}],
          marginTop: -2 * scale,
        }}
      />
    </View>
  );
}

function BadgeOutlineIcon({color, size = 16}: IconProps) {
  const scale = size / 16;
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={{
          width: 12 * scale,
          height: 14 * scale,
          borderWidth: 1.5 * scale,
          borderColor: color,
          borderTopLeftRadius: 6 * scale,
          borderTopRightRadius: 6 * scale,
          borderBottomLeftRadius: 2 * scale,
          borderBottomRightRadius: 2 * scale,
        }}
      />
    </View>
  );
}

function VerifiedIcon({color, size = 12}: IconProps) {
  const scale = size / 12;
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={{
          width: 6 * scale,
          height: 3 * scale,
          borderLeftWidth: 1.5 * scale,
          borderBottomWidth: 1.5 * scale,
          borderColor: color,
          transform: [{rotate: '-45deg'}],
          marginTop: -1 * scale,
        }}
      />
    </View>
  );
}

function PersonIcon({color, size = 36}: IconProps) {
  const scale = size / 36;
  const head = 12 * scale;
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={{
          width: head,
          height: head,
          borderRadius: head / 2,
          backgroundColor: color,
        }}
      />
      <View
        style={{
          width: 20 * scale,
          height: 10 * scale,
          borderTopLeftRadius: 10 * scale,
          borderTopRightRadius: 10 * scale,
          backgroundColor: color,
          marginTop: 3 * scale,
        }}
      />
    </View>
  );
}

function CloseIcon({color, size = 18}: IconProps) {
  const scale = size / 18;
  const bar = 12 * scale;
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={{
          position: 'absolute',
          width: bar,
          height: 2 * scale,
          backgroundColor: color,
          transform: [{rotate: '45deg'}],
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: bar,
          height: 2 * scale,
          backgroundColor: color,
          transform: [{rotate: '-45deg'}],
        }}
      />
    </View>
  );
}

function PhotoLibraryIcon({color, size = 24}: IconProps) {
  const scale = size / 24;
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={{
          width: 18 * scale,
          height: 14 * scale,
          borderWidth: 1.5 * scale,
          borderColor: color,
          borderRadius: 2 * scale,
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 5 * scale,
          left: 4 * scale,
          width: 0,
          height: 0,
          borderLeftWidth: 4 * scale,
          borderRightWidth: 4 * scale,
          borderBottomWidth: 5 * scale,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: color,
        }}
      />
    </View>
  );
}

function CameraAltIcon({color, size = 24}: IconProps) {
  const scale = size / 24;
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={{
          width: 18 * scale,
          height: 12 * scale,
          borderWidth: 1.5 * scale,
          borderColor: color,
          borderRadius: 2 * scale,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: 6 * scale,
          height: 6 * scale,
          borderRadius: 3 * scale,
          borderWidth: 1.5 * scale,
          borderColor: color,
        }}
      />
    </View>
  );
}

function ChevronRightIcon({color, size = 18}: IconProps) {
  const scale = size / 18;
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={{
          width: 8 * scale,
          height: 8 * scale,
          borderRightWidth: 2 * scale,
          borderTopWidth: 2 * scale,
          borderColor: color,
          transform: [{rotate: '45deg'}],
          marginLeft: -2 * scale,
        }}
      />
    </View>
  );
}

function CheckIcon({color, size = 20}: IconProps) {
  const scale = size / 20;
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={{
          width: 10 * scale,
          height: 5 * scale,
          borderLeftWidth: 2 * scale,
          borderBottomWidth: 2 * scale,
          borderColor: color,
          transform: [{rotate: '-45deg'}],
          marginTop: -2 * scale,
        }}
      />
    </View>
  );
}

function RefreshIcon({color, size = 22}: IconProps) {
  const scale = size / 22;
  const ring = 16 * scale;
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={{
          width: ring,
          height: ring,
          borderRadius: ring / 2,
          borderWidth: 2 * scale,
          borderColor: color,
          borderTopColor: 'transparent',
          borderRightColor: 'transparent',
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: 2 * scale,
          right: 4 * scale,
          width: 0,
          height: 0,
          borderLeftWidth: 3 * scale,
          borderRightWidth: 3 * scale,
          borderBottomWidth: 4 * scale,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: color,
        }}
      />
    </View>
  );
}

function SyncIcon({color, size = 18}: IconProps) {
  return <RefreshIcon color={color} size={size} />;
}

function CheckCircleIcon({color, size = 18}: IconProps) {
  const scale = size / 18;
  const ring = 16 * scale;
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={{
          width: ring,
          height: ring,
          borderRadius: ring / 2,
          borderWidth: 1.5 * scale,
          borderColor: color,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: 7 * scale,
            height: 4 * scale,
            borderLeftWidth: 1.5 * scale,
            borderBottomWidth: 1.5 * scale,
            borderColor: color,
            transform: [{rotate: '-45deg'}],
            marginTop: -1 * scale,
          }}
        />
      </View>
    </View>
  );
}

function ErrorOutlineIcon({color, size = 18}: IconProps) {
  const scale = size / 18;
  const ring = 16 * scale;
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={{
          width: ring,
          height: ring,
          borderRadius: ring / 2,
          borderWidth: 1.5 * scale,
          borderColor: color,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: 1.5 * scale,
            height: 1.5 * scale,
            borderRadius: scale,
            backgroundColor: color,
            marginBottom: 2 * scale,
          }}
        />
        <View
          style={{
            width: 1.5 * scale,
            height: 5 * scale,
            backgroundColor: color,
          }}
        />
      </View>
    </View>
  );
}

function CloudOffIcon({color, size = 36}: IconProps) {
  const scale = size / 36;
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={{
          width: 24 * scale,
          height: 12 * scale,
          borderWidth: 2 * scale,
          borderColor: color,
          borderRadius: 8 * scale,
          borderBottomWidth: 0,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: 20 * scale,
          height: 2 * scale,
          backgroundColor: color,
          transform: [{rotate: '-35deg'}],
        }}
      />
    </View>
  );
}

function HubIcon({color, size = 36}: IconProps) {
  const scale = size / 36;
  const dot = 8 * scale;
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={{
          width: dot,
          height: dot,
          borderRadius: dot / 2,
          backgroundColor: color,
        }}
      />
      <View style={{flexDirection: 'row', marginTop: 4 * scale}}>
        <View
          style={{
            width: dot,
            height: dot,
            borderRadius: dot / 2,
            backgroundColor: color,
            marginRight: 8 * scale,
          }}
        />
        <View
          style={{
            width: dot,
            height: dot,
            borderRadius: dot / 2,
            backgroundColor: color,
          }}
        />
      </View>
    </View>
  );
}

function FolderOutlineIcon({color, size = 14}: IconProps) {
  const scale = size / 14;
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={{
          width: 12 * scale,
          height: 9 * scale,
          borderWidth: 1.5 * scale,
          borderColor: color,
          borderRadius: 1.5 * scale,
        }}
      />
    </View>
  );
}

function PersonOutlineIcon({color, size = 14}: IconProps) {
  return <PersonIcon color={color} size={size} />;
}

function ScheduleIcon({color, size = 14}: IconProps) {
  const scale = size / 14;
  const ring = 12 * scale;
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={{
          width: ring,
          height: ring,
          borderRadius: ring / 2,
          borderWidth: 1.5 * scale,
          borderColor: color,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: 1.5 * scale,
          height: 4 * scale,
          backgroundColor: color,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: 3 * scale,
          height: 1.5 * scale,
          backgroundColor: color,
          marginLeft: 1 * scale,
          marginTop: -1 * scale,
        }}
      />
    </View>
  );
}

function LinkIcon({color, size = 14}: IconProps) {
  const scale = size / 14;
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={{
          width: 6 * scale,
          height: 6 * scale,
          borderWidth: 1.5 * scale,
          borderColor: color,
          borderRadius: 3 * scale,
          transform: [{rotate: '45deg'}],
          marginRight: -2 * scale,
        }}
      />
      <View
        style={{
          width: 6 * scale,
          height: 6 * scale,
          borderWidth: 1.5 * scale,
          borderColor: color,
          borderRadius: 3 * scale,
          transform: [{rotate: '45deg'}],
          marginLeft: -2 * scale,
        }}
      />
    </View>
  );
}

const ICON_RENDERERS: Record<
  MineIconName,
  (props: IconProps) => React.ReactElement
> = {
  info_outline: InfoOutlineIcon,
  event_available_outlined: EventAvailableIcon,
  settings_outlined: SettingsOutlineIcon,
  logout_rounded: LogoutIcon,
  login_rounded: LoginIcon,
  arrow_back_ios_new: ArrowBackIcon,
  keyboard_arrow_down: KeyboardArrowDownIcon,
  badge_outlined: BadgeOutlineIcon,
  verified: VerifiedIcon,
  person: PersonIcon,
  close: CloseIcon,
  photo_library_outlined: PhotoLibraryIcon,
  camera_alt_outlined: CameraAltIcon,
  chevron_right_rounded: ChevronRightIcon,
  check_rounded: CheckIcon,
  refresh_rounded: RefreshIcon,
  sync_rounded: SyncIcon,
  check_circle_rounded: CheckCircleIcon,
  error_outline_rounded: ErrorOutlineIcon,
  cloud_off_rounded: CloudOffIcon,
  hub_rounded: HubIcon,
  folder_outlined: FolderOutlineIcon,
  person_outline_rounded: PersonOutlineIcon,
  schedule_rounded: ScheduleIcon,
  link_rounded: LinkIcon,
};

export function MineIcon({
  name,
  color,
  size,
}: {
  name: MineIconName;
  color: string;
  size?: number;
}) {
  const renderer = ICON_RENDERERS[name];
  if (!renderer) {
    return <View style={{width: size ?? 22, height: size ?? 22}} />;
  }
  return renderer({color, size});
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

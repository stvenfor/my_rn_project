import React, {useState} from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {PrimaryButton} from '@ui/design-system';
import {bfuiImages, BFUI_FONTS} from '../assets/bfuiAssets';
import {
  BfuiChip,
  BfuiHeroCard,
  BfuiListCard,
  BfuiPage,
  BfuiStatRow,
} from '../components/BfuiLayout';
import {bfuiColors} from '../theme/bfuiTheme';

const INTRO_STEPS = [
  {title: 'Welcome', body: 'Find your calm space'},
  {title: 'Relax', body: 'Breathe and unwind'},
  {title: 'Care', body: 'Track mood and wellness'},
  {title: 'Diary', body: 'Record your journey'},
];

export function IntroAnimationTemplate() {
  const [step, setStep] = useState(0);
  const current = INTRO_STEPS[step];
  const introImages = [
    bfuiImages.introduction_animation_welcome,
    bfuiImages.introduction_animation_relax_image,
    bfuiImages.introduction_animation_care_image,
    bfuiImages.introduction_animation_mood_dairy_image,
  ];
  return (
    <BfuiPage backgroundColor={bfuiColors.introBg}>
      <Image
        source={introImages[step]}
        style={styles.introImage}
        resizeMode="contain"
      />
      <Text style={[styles.introTitle, {fontFamily: BFUI_FONTS.workSansBold}]}>
        {current.title}
      </Text>
      <Text style={styles.introBody}>{current.body}</Text>
      <View style={styles.dots}>
        {INTRO_STEPS.map((_, i) => (
          <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
        ))}
      </View>
      <PrimaryButton
        title={step < INTRO_STEPS.length - 1 ? 'Next' : 'Get Started'}
        onPress={() => setStep(s => Math.min(s + 1, INTRO_STEPS.length - 1))}
      />
    </BfuiPage>
  );
}

export function HotelBookingTemplate() {
  const {t} = useTranslation();
  return (
    <BfuiPage>
      <BfuiHeroCard
        title={t('bfuiHotelBooking')}
        subtitle="London · 2 guests"
        accent={bfuiColors.hotelPrimary}
        imageSource={bfuiImages.hotel_hotel_booking}
      />
      <View style={styles.chipRow}>
        {['All', 'Popular', 'Best Deal', 'Free Cancel'].map((c, i) => (
          <BfuiChip key={c} label={c} active={i === 1} />
        ))}
      </View>
      <BfuiListCard
        title="Grand Royal Hotel"
        subtitle="Westminster, London"
        meta="$125 / night"
        imageSource={bfuiImages.hotel_hotel_1}
      />
      <BfuiListCard
        title="Queen's Hotel"
        subtitle="Kensington, London"
        meta="$98 / night"
        imageSource={bfuiImages.hotel_hotel_2}
      />
      <BfuiListCard
        title="Sea View Resort"
        subtitle="Brighton"
        meta="$156 / night"
        imageSource={bfuiImages.hotel_hotel_3}
      />
    </BfuiPage>
  );
}

export function HotelFiltersTemplate() {
  return (
    <BfuiPage>
      <Text style={styles.section}>Price range</Text>
      <BfuiStatRow
        items={[
          {label: 'Min', value: '$50'},
          {label: 'Max', value: '$300'},
        ]}
      />
      <Text style={styles.section}>Popular filters</Text>
      <View style={styles.chipRow}>
        {['Free Breakfast', 'Pool', 'Pet Friendly', 'Parking'].map((c, i) => (
          <BfuiChip key={c} label={c} active={i % 2 === 0} />
        ))}
      </View>
      <PrimaryButton title="Apply Filters" onPress={() => {}} />
    </BfuiPage>
  );
}

export function FitnessAppTemplate() {
  return (
    <BfuiPage backgroundColor={bfuiColors.fitnessBg}>
      <BfuiHeroCard
        title="Fitness App"
        subtitle="Your daily activity overview"
        imageSource={bfuiImages.fitness_app_fitness_app}
      />
      <BfuiStatRow
        items={[
          {label: 'Steps', value: '8,432'},
          {label: 'Calories', value: '420'},
          {label: 'Active', value: '52m'},
        ]}
      />
      <BfuiListCard
        title="Morning Run"
        subtitle="5.2 km · 32 min"
        meta="Completed"
      />
      <BfuiListCard
        title="HIIT Workout"
        subtitle="20 min · Core"
        meta="Scheduled"
      />
    </BfuiPage>
  );
}

export function MyDiaryTemplate() {
  return (
    <BfuiPage backgroundColor={bfuiColors.fitnessBg}>
      <BfuiHeroCard title="My Diary" subtitle="Today, March 12" />
      <Text style={styles.section}>Water intake</Text>
      <BfuiStatRow
        items={[
          {label: 'Glasses', value: '6/8'},
          {label: 'Liters', value: '1.5L'},
        ]}
      />
      <Text style={styles.section}>Meals</Text>
      <BfuiListCard
        title="Breakfast"
        subtitle="Oatmeal & berries"
        meta="320 kcal"
      />
      <BfuiListCard
        title="Lunch"
        subtitle="Grilled chicken salad"
        meta="480 kcal"
      />
    </BfuiPage>
  );
}

export function TrainingTemplate() {
  return (
    <BfuiPage backgroundColor={bfuiColors.fitnessBg}>
      <BfuiHeroCard title="Training Plan" subtitle="Week 3 · Strength" />
      <BfuiListCard
        title="Upper Body"
        subtitle="45 min · 8 exercises"
        meta="Mon"
      />
      <BfuiListCard
        title="Cardio Intervals"
        subtitle="30 min · HIIT"
        meta="Wed"
      />
      <BfuiListCard
        title="Lower Body"
        subtitle="50 min · 10 exercises"
        meta="Fri"
      />
    </BfuiPage>
  );
}

export function DesignCourseTemplate() {
  return (
    <BfuiPage>
      <BfuiHeroCard
        title="Design Course"
        subtitle="Popular categories"
        accent={bfuiColors.coursePrimary}
        imageSource={bfuiImages.design_course_design_course}
      />
      <View style={styles.chipRow}>
        {['UI Design', 'UX Research', 'Typography', 'Motion'].map((c, i) => (
          <BfuiChip key={c} label={c} active={i === 0} />
        ))}
      </View>
      <BfuiListCard
        title="UI Design Masterclass"
        subtitle="24 lessons"
        meta="4.8 ★"
      />
      <BfuiListCard
        title="Design Thinking"
        subtitle="18 lessons"
        meta="4.6 ★"
      />
    </BfuiPage>
  );
}

export function CourseInfoTemplate() {
  return (
    <BfuiPage>
      <View style={styles.courseHero} />
      <Text style={styles.courseTitle}>UI Design Masterclass</Text>
      <Text style={styles.courseMeta}>By Angela · 24 lessons · 12h</Text>
      <Text style={styles.section}>About this course</Text>
      <Text style={styles.paragraph}>
        Learn visual hierarchy, layout systems, and mobile-first design patterns
        aligned with BFUI templates.
      </Text>
      <PrimaryButton title="Enroll Now" onPress={() => {}} />
    </BfuiPage>
  );
}

export function HelpTemplate() {
  const {t} = useTranslation();
  return (
    <BfuiPage>
      <Image
        source={bfuiImages.images_helpImage}
        style={styles.illustrationImage}
        resizeMode="contain"
      />
      <Text style={styles.helpTitle}>{t('bfuiHelp')}</Text>
      <Text style={styles.paragraph}>
        How can we help you? It looks like you are experiencing problems with
        our sign up process.
      </Text>
      <PrimaryButton title="Chat with us" onPress={() => {}} />
    </BfuiPage>
  );
}

export function FeedbackTemplate() {
  return (
    <BfuiPage>
      <Image
        source={bfuiImages.images_feedbackImage}
        style={styles.illustrationImage}
        resizeMode="contain"
      />
      <Text style={styles.helpTitle}>Your Feedback</Text>
      <Text style={styles.paragraph}>Give your best time for this moment.</Text>
      <TextInput
        style={styles.input}
        placeholder="Tell us what you think..."
        multiline
      />
      <PrimaryButton title="Submit" onPress={() => {}} />
    </BfuiPage>
  );
}

export function InviteFriendTemplate() {
  return (
    <BfuiPage>
      <BfuiHeroCard
        title="Invite Friends"
        subtitle="Share and earn rewards"
        imageSource={bfuiImages.images_inviteImage}
      />
      <BfuiListCard
        title="Share link"
        subtitle="Copy invitation URL"
        meta="Tap to copy"
      />
      <BfuiListCard title="Contacts" subtitle="Invite from address book" />
      <BfuiListCard title="Social" subtitle="Share to WeChat / Weibo" />
    </BfuiPage>
  );
}

export function NavigationDrawerTemplate() {
  const items = ['Home', 'My Diary', 'Training', 'Settings', 'Help', 'Logout'];
  return (
    <BfuiPage>
      <View style={styles.drawerHeader}>
        <View style={styles.avatar} />
        <Text style={styles.drawerName}>BFUI User</Text>
        <Text style={styles.drawerEmail}>user@example.com</Text>
      </View>
      {items.map(item => (
        <Pressable key={item} style={styles.drawerItem}>
          <Text style={styles.drawerItemText}>{item}</Text>
        </Pressable>
      ))}
    </BfuiPage>
  );
}

export function GlassViewTemplate() {
  return (
    <BfuiPage backgroundColor={bfuiColors.fitnessBg}>
      <View style={styles.glassCard}>
        <Text style={styles.glassTitle}>Glass Card</Text>
        <Text style={styles.glassSub}>
          Frosted overlay · animation degraded
        </Text>
        <BfuiStatRow
          items={[
            {label: 'HR', value: '72'},
            {label: 'SpO2', value: '98%'},
          ]}
        />
      </View>
    </BfuiPage>
  );
}

export function WaveViewTemplate() {
  return (
    <BfuiPage backgroundColor={bfuiColors.fitnessBg}>
      <View style={styles.waveCircle}>
        <Text style={styles.wavePct}>62%</Text>
      </View>
      <Text style={styles.paragraph}>
        Wave animation placeholder (62% hydration)
      </Text>
    </BfuiPage>
  );
}

export function RunningViewTemplate() {
  return (
    <BfuiPage backgroundColor={bfuiColors.fitnessBg}>
      <BfuiStatRow
        items={[
          {label: 'Distance', value: '5.2km'},
          {label: 'Pace', value: '5\'40"'},
          {label: 'Time', value: '32m'},
        ]}
      />
      <View style={styles.barChart}>
        {[40, 65, 50, 80, 55, 70].map((h, i) => (
          <View key={i} style={[styles.bar, {height: h}]} />
        ))}
      </View>
    </BfuiPage>
  );
}

export function WorkoutViewTemplate() {
  return (
    <BfuiPage backgroundColor={bfuiColors.fitnessBg}>
      <Text style={styles.section}>Weekly workout</Text>
      <View style={styles.barChart}>
        {[30, 55, 40, 75, 60, 85, 45].map((h, i) => (
          <View
            key={i}
            style={[
              styles.bar,
              {height: h, backgroundColor: bfuiColors.chartBar},
            ]}
          />
        ))}
      </View>
      <BfuiListCard
        title="Core Strength"
        subtitle="Completed 3 sets"
        meta="Today"
      />
    </BfuiPage>
  );
}

export function MediterraneanDietTemplate() {
  const segments = [
    {label: 'Veggies', pct: 35, color: '#4CAF50'},
    {label: 'Protein', pct: 25, color: '#FF9800'},
    {label: 'Grains', pct: 25, color: '#2196F3'},
    {label: 'Fats', pct: 15, color: '#9C27B0'},
  ];
  return (
    <BfuiPage backgroundColor={bfuiColors.fitnessBg}>
      <Text style={styles.section}>Mediterranean Diet</Text>
      {segments.map(s => (
        <View key={s.label} style={styles.dietRow}>
          <Text style={styles.dietLabel}>{s.label}</Text>
          <View style={styles.dietTrack}>
            <View
              style={[
                styles.dietFill,
                {width: `${s.pct}%`, backgroundColor: s.color},
              ]}
            />
          </View>
          <Text style={styles.dietPct}>{s.pct}%</Text>
        </View>
      ))}
    </BfuiPage>
  );
}

const styles = StyleSheet.create({
  introImage: {width: '100%', height: 200, marginBottom: 16},
  introTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: bfuiColors.darkerText,
    marginTop: 48,
  },
  introBody: {
    fontSize: 16,
    color: bfuiColors.lightText,
    marginTop: 12,
    marginBottom: 24,
  },
  dots: {flexDirection: 'row', marginBottom: 24},
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginRight: 8,
  },
  dotActive: {backgroundColor: bfuiColors.hotelPrimary, width: 20},
  chipRow: {flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12},
  section: {
    fontSize: 16,
    fontWeight: '600',
    color: bfuiColors.darkerText,
    marginVertical: 8,
  },
  courseHero: {
    height: 180,
    borderRadius: 12,
    backgroundColor: bfuiColors.coursePrimary,
    marginBottom: 16,
  },
  courseTitle: {fontSize: 22, fontWeight: '700', color: bfuiColors.darkerText},
  courseMeta: {fontSize: 14, color: bfuiColors.lightText, marginBottom: 12},
  paragraph: {
    fontSize: 15,
    color: bfuiColors.darkText,
    lineHeight: 22,
    marginBottom: 16,
  },
  illustrationImage: {
    height: 160,
    borderRadius: 12,
    marginBottom: 16,
    width: '100%',
  },
  illustration: {
    height: 160,
    borderRadius: 12,
    backgroundColor: bfuiColors.chipBackground,
    marginBottom: 16,
  },
  helpTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: bfuiColors.darkerText,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  drawerHeader: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 8,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: bfuiColors.hotelPrimary,
    marginBottom: 8,
  },
  drawerName: {fontSize: 18, fontWeight: '600'},
  drawerEmail: {fontSize: 13, color: bfuiColors.lightText},
  drawerItem: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  drawerItemText: {fontSize: 16, color: bfuiColors.darkText},
  glassCard: {
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  glassTitle: {fontSize: 18, fontWeight: '700', color: bfuiColors.darkerText},
  glassSub: {fontSize: 13, color: bfuiColors.lightText, marginVertical: 8},
  waveCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 12,
    borderColor: '#4DD0C8',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  wavePct: {fontSize: 36, fontWeight: '700', color: bfuiColors.darkerText},
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    gap: 8,
    marginVertical: 16,
  },
  bar: {flex: 1, backgroundColor: '#4DD0C8', borderRadius: 4},
  dietRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 10},
  dietLabel: {width: 70, fontSize: 13, color: bfuiColors.darkText},
  dietTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
  },
  dietFill: {height: 8, borderRadius: 4},
  dietPct: {
    width: 36,
    textAlign: 'right',
    fontSize: 12,
    color: bfuiColors.lightText,
  },
});

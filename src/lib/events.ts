import posthog from "posthog-js";

export interface EventProperties {
  [key: string]: string | number | boolean | object | undefined;
}

export const events = {
  userSignup: (props?: EventProperties) => {
    posthog.capture("user_signup", props);
  },

  onboardingCompleted: (props: {
    aiExperienceLevel?: string;
    primaryGoal?: string;
    pathStage?: string;
    resourceCount?: number;
  }) => {
    posthog.capture("onboarding_completed", {
      ai_experience_level: props.aiExperienceLevel,
      primary_goal: props.primaryGoal,
      path_stage: props.pathStage,
      resource_count: props.resourceCount,
    });
  },

  resourceCompleted: (props: {
    resourceId: string;
    resourceType?: string;
    isFirstResource: boolean;
    timeToCompletionHours?: number;
    resourceStage?: string;
  }) => {
    posthog.capture("resource_completed", {
      resource_id: props.resourceId,
      resource_type: props.resourceType,
      is_first_resource: props.isFirstResource,
      time_to_completion_hours: props.timeToCompletionHours,
      resource_stage: props.resourceStage,
    });
  },

  resourceAssigned: (props: {
    resourceId: string;
    resourceCount: number;
    pathStage?: string;
  }) => {
    posthog.capture("resource_assigned", {
      resource_id: props.resourceId,
      resource_count: props.resourceCount,
      path_stage: props.pathStage,
    });
  },

  sessionStart: (props?: {
    sessionId?: string;
    deviceType?: string;
  }) => {
    posthog.capture("session_start", {
      session_id: props?.sessionId,
      device_type: props?.deviceType,
    });
  },

  resourceViewed: (props: {
    resourceId: string;
    resourceType?: string;
  }) => {
    posthog.capture("resource_viewed", {
      resource_id: props.resourceId,
      resource_type: props.resourceType,
    });
  },
};

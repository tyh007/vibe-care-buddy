import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface RewardState {
  points: number;
  level: number;
  streak: number;
  lastCheckIn: string | null;
  totalCheckIns: number;
  completedActivities: number;
}

const LEVEL_THRESHOLDS = [0, 50, 150, 300, 500, 800, 1200, 1700];

const REWARD_POINTS = {
  moodCheckIn: 5,
  addEvent: 3,
  completeActivity: 10,
  addNotes: 5,
  streakBonus: 15,
  weeklyGoal: 25,
};

export const useRewardSystem = () => {
  const { toast } = useToast();
  const [rewardState, setRewardState] = useState<RewardState>(() => {
    const saved = localStorage.getItem('vibeRewardState');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      points: 0,
      level: 0,
      streak: 0,
      lastCheckIn: null,
      totalCheckIns: 0,
      completedActivities: 0,
    };
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('vibeRewardState', JSON.stringify(rewardState));
  }, [rewardState]);

  // Calculate level based on points
  const calculateLevel = useCallback((points: number) => {
    let level = 0;
    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
      if (points >= LEVEL_THRESHOLDS[i]) {
        level = i;
      } else {
        break;
      }
    }
    return level;
  }, []);

  // Award points with toast notification
  const awardPoints = useCallback((amount: number, reason: string, emoji: string = "⭐") => {
    setRewardState(prev => {
      const newPoints = prev.points + amount;
      const newLevel = calculateLevel(newPoints);
      const leveledUp = newLevel > prev.level;

      // Show toast notification
      setTimeout(() => {
        toast({
          title: leveledUp ? "🎉 Level Up!" : `${emoji} +${amount} Vibe Energy!`,
          description: leveledUp 
            ? `You reached Level ${newLevel}! ${reason}` 
            : reason,
        });
      }, 100);

      return {
        ...prev,
        points: newPoints,
        level: newLevel,
      };
    });
  }, [calculateLevel, toast]);

  // Specific reward functions
  const rewardMoodCheckIn = useCallback(() => {
    const today = new Date().toDateString();
    
    setRewardState(prev => {
      const lastCheckIn = prev.lastCheckIn;
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      
      // Check if already checked in today
      if (lastCheckIn === today) {
        return prev;
      }

      const newTotalCheckIns = prev.totalCheckIns + 1;
      let newStreak = prev.streak;
      let bonusPoints = REWARD_POINTS.moodCheckIn;
      
      // Update streak
      if (lastCheckIn === yesterday) {
        newStreak = prev.streak + 1;
        if (newStreak % 7 === 0) {
          bonusPoints += REWARD_POINTS.streakBonus;
        }
      } else if (lastCheckIn !== today) {
        newStreak = 1;
      }

      const newPoints = prev.points + bonusPoints;
      const newLevel = calculateLevel(newPoints);
      const leveledUp = newLevel > prev.level;

      // Show toast
      setTimeout(() => {
        toast({
          title: leveledUp ? "🎉 Level Up!" : `💙 +${bonusPoints} Vibe Energy!`,
          description: leveledUp 
            ? `You reached Level ${newLevel}! Keep checking in!`
            : newStreak > 1 
              ? `${newStreak} day streak! Keep going!` 
              : "Thanks for checking in!",
        });
      }, 100);

      return {
        ...prev,
        points: newPoints,
        level: newLevel,
        streak: newStreak,
        lastCheckIn: today,
        totalCheckIns: newTotalCheckIns,
      };
    });
  }, [calculateLevel, toast]);

  const rewardEventCreation = useCallback(() => {
    awardPoints(REWARD_POINTS.addEvent, "Great job planning ahead!", "📅");
  }, [awardPoints]);

  const rewardActivityCompletion = useCallback(() => {
    setRewardState(prev => {
      const newActivities = prev.completedActivities + 1;
      const newPoints = prev.points + REWARD_POINTS.completeActivity;
      const newLevel = calculateLevel(newPoints);
      const leveledUp = newLevel > prev.level;

      setTimeout(() => {
        toast({
          title: leveledUp ? "🎉 Level Up!" : "🌟 +10 Vibe Energy!",
          description: leveledUp 
            ? `You reached Level ${newLevel}! ${newActivities} activities completed!`
            : `${newActivities} wellness activities completed!`,
        });
      }, 100);

      return {
        ...prev,
        points: newPoints,
        level: newLevel,
        completedActivities: newActivities,
      };
    });
  }, [calculateLevel, toast]);

  const rewardNotesTaken = useCallback(() => {
    awardPoints(REWARD_POINTS.addNotes, "Reflection helps you grow!", "📝");
  }, [awardPoints]);

  return {
    ...rewardState,
    awardPoints,
    rewardMoodCheckIn,
    rewardEventCreation,
    rewardActivityCompletion,
    rewardNotesTaken,
  };
};

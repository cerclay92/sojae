'use server';

import { getSupabaseServer } from '@/lib/supabase-server';
import { type Database } from '@/lib/supabase';
import { SubscriptionType } from '@/constants/subscription';
import { addMonths } from 'date-fns';

export type Subscription = Database['public']['Tables']['subscriptions']['Row'];

export async function createSubscription({
  email,
  subscriptionType,
  paymentId,
}: {
  email: string;
  subscriptionType: SubscriptionType;
  paymentId?: string;
}) {
  try {
    const supabase = getSupabaseServer();
    
    // 구독 유형에 따라 만료일 계산
    let expiresAt: Date;

    if (subscriptionType === 'monthly') {
      expiresAt = addMonths(new Date(), 1);
    } else {
      expiresAt = addMonths(new Date(), 12);
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .insert([
        {
          email,
          status: 'active',
          subscription_type: subscriptionType,
          expires_at: expiresAt.toISOString(),
          payment_id: paymentId,
        },
      ])
      .select();

    if (error) {
      if (error.code === '23505') {
        // 중복된 이메일일 경우 업데이트
        return updateSubscription(email, {
          status: 'active',
          subscription_type: subscriptionType,
          expires_at: expiresAt.toISOString(),
          payment_id: paymentId,
        });
      }
      throw new Error(`Failed to create subscription: ${error.message}`);
    }

    return data[0] as Subscription;
  } catch (error) {
    console.error('구독 생성 실패:', error);
    throw error;
  }
}

export async function getSubscriptionByEmail(email: string) {
  try {
    const supabase = getSupabaseServer();
    
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      // 구독이 없을 경우 null 반환
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch subscription: ${error.message}`);
    }

    return data as Subscription;
  } catch (error) {
    console.error('구독 정보 가져오기 실패:', error);
    return null;
  }
}

export async function updateSubscription(
  email: string,
  subscription: Partial<Omit<Subscription, 'id' | 'created_at' | 'updated_at' | 'email'>>
) {
  try {
    const supabase = getSupabaseServer();
    
    const { data, error } = await supabase
      .from('subscriptions')
      .update(subscription)
      .eq('email', email)
      .select();

    if (error) {
      throw new Error(`Failed to update subscription: ${error.message}`);
    }

    return data[0] as Subscription;
  } catch (error) {
    console.error('구독 업데이트 실패:', error);
    throw error;
  }
}

export async function cancelSubscription(email: string) {
  try {
    const supabase = getSupabaseServer();
    
    const { data, error } = await supabase
      .from('subscriptions')
      .update({ status: 'canceled' })
      .eq('email', email)
      .select();

    if (error) {
      throw new Error(`Failed to cancel subscription: ${error.message}`);
    }

    return data[0] as Subscription;
  } catch (error) {
    console.error('구독 취소 실패:', error);
    throw error;
  }
}

export async function getAllSubscribers() {
  try {
    const supabase = getSupabaseServer();
    
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch subscribers: ${error.message}`);
    }

    return data as Subscription[];
  } catch (error) {
    console.error('구독자 목록 가져오기 실패:', error);
    return [];
  }
}

export async function getSubscriberCount() {
  try {
    const supabase = getSupabaseServer();
    
    const { count, error } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    if (error) {
      throw new Error(`Failed to fetch subscriber count: ${error.message}`);
    }

    return count;
  } catch (error) {
    console.error('구독자 수 가져오기 실패:', error);
    return 0;
  }
} 
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// 가능한 버킷 이름 목록
const POSSIBLE_BUCKET_NAMES = ['images', 'image', 'uploads', 'media', 'assets'];

/**
 * Supabase에 이미지를 업로드하고 URL을 반환합니다.
 * 여러 가능한 버킷 이름을 시도합니다.
 */
export async function uploadImageToSupabase(file: File): Promise<string> {
  try {
    // 사용 가능한 버킷 목록 조회
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('버킷 목록 조회 오류:', bucketsError.message);
      console.log('기본 버킷을 사용하여 시도합니다.');
      // 기본 버킷 이름으로 시도
      return tryUploadToDefaultBucket(file);
    }
    
    // 사용 가능한 버킷이 없으면 기본 버킷 시도
    if (!buckets || buckets.length === 0) {
      console.warn('사용 가능한 버킷이 없습니다. 기본 버킷을 사용하여 시도합니다.');
      return tryUploadToDefaultBucket(file);
    }
    
    // 버킷 이름 목록 (실제 존재하는 버킷만)
    const availableBuckets = buckets.map(bucket => bucket.name);
    console.log('사용 가능한 버킷:', availableBuckets);
    
    // 사용할 버킷 결정 (목록에서 첫 번째 버킷 사용)
    const bucketToUse = availableBuckets[0];
    
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from(bucketToUse).upload(fileName, file);
    
    if (error) {
      console.error(`이미지 업로드 오류 (${bucketToUse}):`, error.message);
      // 기본 버킷으로 시도
      return tryUploadToDefaultBucket(file);
    }
    
    const { data: publicUrl } = supabase.storage.from(bucketToUse).getPublicUrl(fileName);
    console.log('이미지 업로드 성공:', publicUrl.publicUrl);
    return publicUrl.publicUrl;
  } catch (err: any) {
    console.error('이미지 업로드 중 예외 발생:', err);
    // 기본 버킷으로 시도
    return tryUploadToDefaultBucket(file);
  }
}

/**
 * 기본 버킷('images')을 사용하여 이미지 업로드를 시도합니다.
 */
async function tryUploadToDefaultBucket(file: File): Promise<string> {
  try {
    const DEFAULT_BUCKET = 'images';
    const fileName = `${Date.now()}_${file.name}`;
    
    const { data, error } = await supabase.storage.from(DEFAULT_BUCKET).upload(fileName, file);
    
    if (error) {
      console.error(`기본 버킷(${DEFAULT_BUCKET})에 업로드 실패:`, error.message);
      throw new Error(`이미지 업로드 오류: ${error.message}`);
    }
    
    const { data: publicUrl } = supabase.storage.from(DEFAULT_BUCKET).getPublicUrl(fileName);
    console.log('기본 버킷에 이미지 업로드 성공:', publicUrl.publicUrl);
    return publicUrl.publicUrl;
  } catch (err: any) {
    console.error('기본 버킷에 업로드 중 오류:', err);
    throw new Error('이미지를 업로드할 수 없습니다. 스토리지 버킷이 올바르게 구성되어 있는지 확인하세요.');
  }
}

/**
 * Supabase에서 이미지 목록을 가져옵니다.
 * 여러 가능한 버킷 이름을 시도합니다.
 */
export async function fetchSupabaseImages(): Promise<string[]> {
  try {
    // 사용 가능한 버킷 목록 조회
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('버킷 목록 조회 오류:', bucketsError.message);
      // 기본 버킷 사용
      return tryFetchFromDefaultBucket();
    }
    
    // 사용 가능한 버킷이 없으면 기본 버킷 시도
    if (!buckets || buckets.length === 0) {
      console.warn('사용 가능한 버킷이 없습니다. 기본 버킷을 사용하여 시도합니다.');
      return tryFetchFromDefaultBucket();
    }
    
    // 버킷 이름 목록 (실제 존재하는 버킷만)
    const availableBuckets = buckets.map(bucket => bucket.name);
    console.log('사용 가능한 버킷:', availableBuckets);
    
    // 사용할 버킷 결정 (목록에서 첫 번째 버킷 사용)
    const bucketToUse = availableBuckets[0];
    
    const { data, error } = await supabase.storage.from(bucketToUse).list('', { limit: 100 });
    
    if (error) {
      console.error(`이미지 목록 조회 오류 (${bucketToUse}):`, error.message);
      // 기본 버킷 사용
      return tryFetchFromDefaultBucket();
    }
    
    return data?.map((item) => supabase.storage.from(bucketToUse).getPublicUrl(item.name).data.publicUrl) ?? [];
  } catch (err: any) {
    console.error('이미지 목록 조회 중 예외 발생:', err);
    // 기본 버킷 사용
    return tryFetchFromDefaultBucket();
  }
}

/**
 * 기본 버킷('images')에서 이미지 목록을 조회합니다.
 */
async function tryFetchFromDefaultBucket(): Promise<string[]> {
  try {
    const DEFAULT_BUCKET = 'images';
    
    const { data, error } = await supabase.storage.from(DEFAULT_BUCKET).list('', { limit: 100 });
    
    if (error) {
      console.error(`기본 버킷(${DEFAULT_BUCKET})에서 이미지 목록 조회 실패:`, error.message);
      return [];
    }
    
    return data?.map((item) => supabase.storage.from(DEFAULT_BUCKET).getPublicUrl(item.name).data.publicUrl) ?? [];
  } catch (err) {
    console.error('기본 버킷에서 이미지 목록 조회 중 오류:', err);
    return [];
  }
} 
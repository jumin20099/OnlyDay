import { api } from "@/lib/api";
import type {
  ApiResponse,
  Cake,
  Letter,
  SavedLetter,
  UnlockState,
} from "@/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCakes(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["cakes"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Cake[]>>("/api/cakes/me");
      if (!data.success) throw new Error(data.error?.message ?? "케이크 조회 실패");
      return data.data;
    },
    enabled: options?.enabled !== undefined ? options.enabled : true,
  });
}

export function useCreateCake() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { title: string; flavor: Cake["flavor"]; birthday: string }) => {
      const { data } = await api.post<ApiResponse<Cake>>("/api/cakes", input);
      if (!data.success) throw new Error(data.error?.message ?? "케이크 생성 실패");
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cakes"] }),
  });
}

export function useUpdateCake() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      cakeId: string;
      title: string;
      flavor: Cake["flavor"];
      birthday: string;
      cakeImageUrl?: string | null;
    }) => {
      const { data } = await api.put<ApiResponse<Cake>>(`/api/cakes/${input.cakeId}`, {
        title: input.title,
        flavor: input.flavor,
        birthday: input.birthday,
        ...(input.cakeImageUrl !== undefined ? { cakeImageUrl: input.cakeImageUrl } : {}),
      });
      if (!data.success) throw new Error(data.error?.message ?? "케이크 수정 실패");
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cakes"] }),
  });
}

export function useCakeByShareToken(shareToken: string) {
  return useQuery({
    queryKey: ["cake", shareToken],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Cake>>(`/api/cakes/share/${shareToken}`);
      if (!data.success) throw new Error(data.error?.message ?? "케이크 조회 실패");
      return data.data;
    },
    enabled: Boolean(shareToken),
  });
}

export function useCreateLetter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      cakeShareToken: string;
      nickname: string;
      positionX: number;
      positionY: number;
      candleColor: string;
      candleStyle: string;
      content: string;
      imageUrl?: string;
    }) => {
      const { data } = await api.post<ApiResponse<unknown>>("/letters", input);
      if (!data.success) throw new Error(data.error?.message ?? "편지 생성 실패");
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["letters"] });
      qc.invalidateQueries({ queryKey: ["cakes"] });
    },
  });
}

export function useLetters(cakeId?: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["letters", cakeId],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Letter[]>>(`/api/cakes/${cakeId}/letters`);
      if (!data.success) throw new Error(data.error?.message ?? "편지 조회 실패");
      return data.data;
    },
    enabled: options?.enabled !== undefined ? options.enabled : Boolean(cakeId),
  });
}

export function useUnlockStates(cakeId?: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["unlock", cakeId],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<UnlockState[]>>(
        `/api/cakes/${cakeId}/unlock-states`
      );
      if (!data.success) throw new Error(data.error?.message ?? "해금 상태 조회 실패");
      return data.data;
    },
    enabled: options?.enabled !== undefined ? options.enabled : Boolean(cakeId),
  });
}

export function useSaveLetter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (letterId: string) => {
      const { data } = await api.post<ApiResponse<null>>(`/letters/${letterId}/save`);
      if (!data.success) throw new Error(data.error?.message ?? "편지 저장 실패");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["saved-letters"] }),
  });
}

export function useSavedLetters(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["saved-letters"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<SavedLetter[]>>("/letters/saved");
      if (!data.success) throw new Error(data.error?.message ?? "보관함 조회 실패");
      return data.data;
    },
    enabled: options?.enabled !== undefined ? options.enabled : true,
  });
}

export async function uploadImageToStorage(file: File, folder = "letters") {
  const form = new FormData();
  form.append("file", file);
  form.append("folder", folder);
  const { data } = await api.post<ApiResponse<{ fileUrl: string | null; objectPath: string; bucket: string; publicBucket: boolean }>>(
    "/files/upload",
    form
  );
  if (!data.success) throw new Error(data.error?.message ?? "이미지 업로드 실패");
  if (!data.data.fileUrl) {
    throw new Error("비공개 버킷은 fileUrl이 없습니다. Supabase Storage 버킷을 public으로 두거나 public-bucket 설정을 확인하세요.");
  }
  return data.data.fileUrl;
}

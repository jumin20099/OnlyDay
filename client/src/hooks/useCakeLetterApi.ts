import { api } from "@/lib/api";
import type {
  ApiResponse,
  Cake,
  Letter,
  SavedLetter,
  UnlockState,
} from "@/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCakes() {
  return useQuery({
    queryKey: ["cakes"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Cake[]>>("/cakes");
      if (!data.success) throw new Error(data.error?.message ?? "케이크 조회 실패");
      return data.data;
    },
  });
}

export function useCreateCake() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      title: string;
      flavor: Cake["flavor"];
      birthday: string;
      openAt: string;
      closeAt: string;
    }) => {
      const { data } = await api.post<ApiResponse<Cake>>("/cakes", input);
      if (!data.success) throw new Error(data.error?.message ?? "케이크 생성 실패");
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cakes"] }),
  });
}

export function useCakeByShareToken(shareToken: string) {
  return useQuery({
    queryKey: ["cake", shareToken],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Cake>>(`/cakes/share/${shareToken}`);
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
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["letters", vars.cakeShareToken] });
      qc.invalidateQueries({ queryKey: ["cakes"] });
    },
  });
}

export function useLetters(cakeId?: string) {
  return useQuery({
    queryKey: ["letters", cakeId],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Letter[]>>(`/api/cakes/${cakeId}/letters`);
      if (!data.success) throw new Error(data.error?.message ?? "편지 조회 실패");
      return data.data;
    },
    enabled: Boolean(cakeId),
  });
}

export function useUnlockStates(cakeId?: string) {
  return useQuery({
    queryKey: ["unlock", cakeId],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<UnlockState[]>>(
        `/api/cakes/${cakeId}/unlock-states`
      );
      if (!data.success) throw new Error(data.error?.message ?? "해금 상태 조회 실패");
      return data.data;
    },
    enabled: Boolean(cakeId),
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

export function useSavedLetters() {
  return useQuery({
    queryKey: ["saved-letters"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<SavedLetter[]>>("/letters/saved");
      if (!data.success) throw new Error(data.error?.message ?? "보관함 조회 실패");
      return data.data;
    },
  });
}

export async function uploadImageToS3(file: File) {
  const { data: presign } = await api.post<
    ApiResponse<{ uploadUrl: string; fileUrl: string; key: string }>
  >("/files/presign", {
    filename: file.name,
    contentType: file.type,
    folder: "letters",
  });
  if (!presign.success) throw new Error(presign.error?.message ?? "업로드 URL 생성 실패");

  await fetch(presign.data.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  return presign.data.fileUrl;
}

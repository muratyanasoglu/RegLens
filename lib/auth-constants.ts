/** Şifre kurtarma için güvenlik sorusu seçenekleri (key: saklanan değer, label: kullanıcıya gösterilen) */
export const SECURITY_QUESTIONS: { value: string; label: string }[] = [
  { value: "mother_maiden", label: "Annenizin kızlık soyadı nedir?" },
  { value: "first_pet", label: "İlk evcil hayvanınızın adı nedir?" },
  { value: "birth_city", label: "Doğduğunuz şehir neresidir?" },
  { value: "first_school", label: "İlk okuduğunuz okulun adı nedir?" },
  { value: "favorite_teacher", label: "En sevdiğiniz öğretmenin adı nedir?" },
  { value: "father_middle", label: "Babanızın ikinci adı nedir?" },
  { value: "first_car", label: "İlk arabanızın markası nedir?" },
  { value: "childhood_nickname", label: "Çocukluk lakabınız nedir?" },
]

export function getSecurityQuestionLabel(value: string): string {
  return SECURITY_QUESTIONS.find((q) => q.value === value)?.label ?? value
}

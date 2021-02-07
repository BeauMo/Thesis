namespace FudgeCore {
  export class TextureDefault extends TextureBase64 {
    public static texture: TextureBase64 = new TextureDefault("TextureDefault", TextureDefault.get());
    private static get(): string {
      return "data:image/png;base64,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LL8FCxbYe++9587JG220kQ0dOtR7Jri0AogKu7y83MaOHWvHH3+87bTTTlZaWuqCxrJly2zlypUuuCgzmTNnjl177bX2/vvv24oVK7yfkD4OwHAov3Aov3Aov3AyUX6qDXr55ZftmWeesfr6erdP5+htt93WttlmG1eLFFRaAURZxp577mnnnHOO9erVy1566SUXKGpqarxXfE9VWspM9KEfeeQRF2CC4AAMh/ILh/ILh/ILJ2z5ff755/bggw/awoXr39JXNUR67oYbbrDevXt7e9OXciO6MgtlHr/73e9cFvL3v//dXn/99YTBQxT1vv76axs+fLjtsssu7j1AVOjEUVlZ6api9agLHiBXqC16+vTpdvPNN28QPETPf/fdd6HbqlP61ujLpozj5z//uXu8//77bfHixe45fYC3337b7bvzzjvt8ccft48//tg9J2pgHzZsmKtzU9oEREGXLl3siCOOsDPPPNOOPvpo69+/P8cncsK8efPsr3/9q7344osug9E5Whf777zzjveKzEkpgBQVFdmmm27qMokXXnjBRS5RY8ztt99u9957r2s4/+ijj+ytt95ykU9tH77OnTvbiBEjyEIQGbr9soLHxIkTbccdd7SjjjrKBg4c2GImoi/i008/bTNmzAjdQQTRpovlY445xrbbbjuXpWaLV1991XVoErVP33rrre6Y7devn9uXSSkFEAWAXXfd1dasWeOyDZ/aN/xsQ18mLWpIX7JkidsXX7+oAFJWVkZVASJD2bEudnTRo2NVvVJUVdscpf2qT37++eddu56+mP7FFHKPOv+oHXfSpEl2yimn2JFHHmmbb7550mMkCvxM+qmnnrLbbrvNtXHceOONrsE801I6m+vE/4Mf/MA++OCDda34ChSvvPJKwkaoVatW2Ztvvula+X1q6e/atav70gJRpDa7dBotr7jiCk2X720h1yxfvtxdJIvOc8pQf/zjH9uvf/1r9zh48OCE57/2tscee7jjeNGiRXbWWWe5C5199tmnVWqAWgwgKiD1vlIV1meffebtNVdFpbq1RF847VPhK1LHZxxKochAEFXKMNIJIMq0NWgWuevf//6360Gq48I/d+kiePTo0a4N7dRTT3VV+z169HDPRYGaHI499liXLZ900kmuDVrDLVpDi2dzBQHVBepDqT7Np4aaZI2Oqu6aO3eu6+Xi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";
    }
  }
}
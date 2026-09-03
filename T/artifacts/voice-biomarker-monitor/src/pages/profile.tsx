import { AppLayout } from "@/components/layout";
import { ShieldCheck, User, Mail, Phone, Calendar, Hash } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/lib/language";

export default function ProfilePage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <AppLayout userType="patient">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-extrabold font-[Manrope] mb-1">{t("profile.title")}</h2>
          <p className="text-muted-foreground">{t("profile.description")}</p>
        </div>

        <div className="bg-card border rounded-[2rem] p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-emerald-500/20">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-extrabold font-[Manrope]">{user?.name}</h3>
              <p className="text-sm text-muted-foreground">{user?.patientId} · {user?.role}</p>
            </div>
          </div>

          <div className="space-y-4">
            <ProfileField icon={User} label="Full Name" value={user?.name} />
            <ProfileField icon={Mail} label="Email" value={user?.email} />
            <ProfileField icon={Phone} label="Phone" value={user?.phone} />
            <ProfileField icon={Calendar} label="Date of Birth" value={(user as any)?.dateOfBirth} />
            <ProfileField icon={Hash} label="ABHA ID" value={user?.abhaId || "Not linked"} />
          </div>
        </div>

        {/* ABDM */}
        <div className="bg-card border rounded-[2rem] p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-lg">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="font-bold text-lg">{t("profile.abdmIntegration")}</h3>
              <p className="text-sm text-muted-foreground">{t("profile.abdmDesc")}</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <ShieldCheck size={18} className="text-blue-600" />
              <div>
                <div className="font-bold text-sm">{t("profile.privacyProtected")}</div>
                <div className="text-xs text-muted-foreground">{t("profile.privacyDesc")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function ProfileField({ icon: Icon, label, value }: { icon: any; label: string; value?: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
      <Icon size={16} className="text-muted-foreground" />
      <div>
        <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{label}</div>
        <div className="font-medium">{value || "Not provided"}</div>
      </div>
    </div>
  );
}

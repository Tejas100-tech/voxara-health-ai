import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings2, Pill, Activity, BrainCircuit, ClipboardList, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function MedicationWorkflow() {
  const { toast } = useToast();

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Adjustment Executed",
      description: "Prescription update has been queued and patient notified.",
    });
  };

  return (
    <AppLayout userType="clinician">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between md:items-end gap-6 border-b pb-8">
          <div className="space-y-2">
            <p className="text-sm font-bold uppercase tracking-widest text-secondary">Record ID: CSAI-88219</p>
            <h1 className="text-4xl md:text-5xl font-[Manrope] font-extrabold tracking-tight text-foreground">
              Elena Rodriguez <span className="text-muted-foreground font-light">| 34Y Female</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium">Primary Diagnosis: Refractory Rheumatoid Arthritis</p>
          </div>
          <div className="flex items-center gap-4 bg-muted/50 p-4 px-6 rounded-2xl">
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase font-black tracking-wider">Vitals Stability</p>
              <p className="text-xl font-[Manrope] font-bold text-primary">High Accuracy (98.2%)</p>
            </div>
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <ClipboardList size={28} />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Current Regimen */}
          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-2xl font-[Manrope] font-bold tracking-tight">Current Regimen</h2>
            <div className="space-y-4">
              
              <div className="bg-card border-l-4 border-l-primary p-6 rounded-3xl shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-[Manrope] font-bold text-xl">Adalimumab</h3>
                  <span className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full uppercase font-black tracking-wider">Priority</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                  <div>
                    <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider mb-1">Dosage</p>
                    <p className="font-semibold text-lg">40 mg</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider mb-1">Freq</p>
                    <p className="font-semibold text-lg">Bi-weekly</p>
                  </div>
                </div>
                <Button className="w-full rounded-xl py-6 font-bold" variant="secondary">
                  Adjust Medication
                </Button>
              </div>

              <div className="bg-card border p-6 rounded-3xl shadow-sm opacity-80">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-[Manrope] font-bold text-xl text-muted-foreground">Methotrexate</h3>
                  <span className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full uppercase font-black tracking-wider">Maint.</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider mb-1">Dosage</p>
                    <p className="font-semibold text-lg">15 mg</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider mb-1">Freq</p>
                    <p className="font-semibold text-lg">Weekly</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right: Adjust Workflow */}
          <div className="lg:col-span-8">
            <div className="bg-card border rounded-[2rem] p-8 md:p-10 shadow-xl relative overflow-hidden">
              <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-[100px]"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                    <Settings2 size={28} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-[Manrope] font-bold tracking-tight">Adjust Dosage: Adalimumab</h2>
                    <p className="text-lg text-muted-foreground mt-1">Neural insights suggest tapering due to stable inflammatory markers.</p>
                  </div>
                </div>

                <form onSubmit={handleExecute} className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Pill size={16}/> New Dosage (mg)
                      </label>
                      <div className="relative">
                        <Input className="bg-muted/50 border-none rounded-2xl py-8 px-6 text-2xl font-[Manrope] font-bold text-foreground" defaultValue="20" />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-lg">mg</span>
                      </div>
                      <p className="text-xs text-muted-foreground font-semibold px-2">Previous: 40 mg</p>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Activity size={16}/> Frequency
                      </label>
                      <Select defaultValue="monthly">
                        <SelectTrigger className="bg-muted/50 border-none rounded-2xl py-8 px-6 text-lg font-semibold h-auto">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="biweekly">Bi-weekly</SelectItem>
                          <SelectItem value="monthly">Monthly (Taper Phase)</SelectItem>
                          <SelectItem value="10days">Every 10 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <ClipboardList size={16}/> Clinical Rationale
                    </label>
                    <Textarea 
                      className="bg-muted/50 border-none rounded-2xl py-6 px-6 text-lg min-h-[120px] resize-none" 
                      placeholder="Document reasoning for dosage adjustment..."
                    />
                  </div>

                  <div className="bg-secondary/10 rounded-3xl p-6 md:p-8 border border-secondary/20">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                      <BrainCircuit className="text-secondary shrink-0" size={32} />
                      <div className="flex-1">
                        <h4 className="text-lg font-[Manrope] font-bold text-secondary mb-4">Safety Check: AI Confirmation</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-sm font-medium">
                            <CheckCircle2 className="text-green-600 shrink-0" size={20}/>
                            <span>No contraindications detected with concurrent Methotrexate use.</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm font-medium">
                            <CheckCircle2 className="text-green-600 shrink-0" size={20}/>
                            <span>Patient weight (68kg) supports the 20mg tapering threshold.</span>
                          </div>
                        </div>
                      </div>
                      <div className="md:ml-auto w-16 h-16 rounded-full border-4 border-secondary border-t-transparent animate-spin flex shrink-0"></div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t gap-4">
                    <Button variant="ghost" className="font-bold w-full md:w-auto text-muted-foreground hover:text-foreground">
                      Discard Changes
                    </Button>
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                      <Button variant="secondary" className="rounded-full py-6 px-8 font-bold text-base w-full md:w-auto">
                        Preview Prescription
                      </Button>
                      <Button type="submit" className="rounded-full py-6 px-10 font-bold text-base w-full md:w-auto shadow-xl shadow-primary/20">
                        Execute Adjustment
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

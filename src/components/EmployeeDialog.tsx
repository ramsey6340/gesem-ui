import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Employee, EmployeeFormData } from "@/types/employee";
// Available positions - you can move this to a constants file later
const positions = [
  "Développeur",
  "Designer",
  "Chef de projet",
  "Analyste",
  "Consultant",
  "Manager",
  "Directeur"
];

interface EmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: Employee;
  onSave: (data: EmployeeFormData) => void;
  mode: 'add' | 'edit';
}

const EmployeeDialog = ({ open, onOpenChange, employee, onSave, mode }: EmployeeDialogProps) => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName: "",
    lastName: "",
    poste: "",
    email: "",
    hiringDate: "",
    enabled: true
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EmployeeFormData, string>>>({});

  useEffect(() => {
    if (employee && mode === 'edit') {
      setFormData({
        firstName: employee.firstName,
        lastName: employee.lastName,
        poste: employee.poste,
        email: employee.email,
        hiringDate: employee.hiringDate.split('T')[0], // Convert to date format
        enabled: employee.enabled
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        poste: "",
        email: "",
        hiringDate: "",
        enabled: true
      });
    }
    setErrors({});
  }, [employee, mode, open]);

  const handleInputChange = (field: keyof EmployeeFormData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EmployeeFormData, string>> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "Le prénom est requis";
    if (!formData.lastName.trim()) newErrors.lastName = "Le nom est requis";
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }
    if (!formData.poste) newErrors.poste = "Le poste est requis";
    if (!formData.hiringDate) newErrors.hiringDate = "La date d'embauche est requise";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Ajouter un employé' : 'Modifier l\'employé'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add' 
              ? 'Remplissez les informations pour ajouter un nouveau employé.'
              : 'Modifiez les informations de l\'employé.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Prénom"
                className={errors.firstName ? "border-red-500" : ""}
              />
              {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Nom *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Nom"
                className={errors.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="email@exemple.com"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>



          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Poste *</Label>
              <Select value={formData.poste} onValueChange={(value) => handleInputChange('poste', value)}>
                <SelectTrigger className={errors.poste ? "border-red-500" : ""}>
                  <SelectValue placeholder="Sélectionner un poste" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((position) => (
                    <SelectItem key={position} value={position}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.poste && <p className="text-sm text-red-500">{errors.poste}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hiringDate">Date d'embauche *</Label>
              <Input
                id="hiringDate"
                type="date"
                value={formData.hiringDate}
                onChange={(e) => handleInputChange('hiringDate', e.target.value)}
                className={errors.hiringDate ? "border-red-500" : ""}
              />
              {errors.hiringDate && <p className="text-sm text-red-500">{errors.hiringDate}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Statut</Label>
            <Select value={formData.enabled ? "enabled" : "disabled"} onValueChange={(value) => handleInputChange('enabled', value === "enabled")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enabled">Actif</SelectItem>
                <SelectItem value="disabled">Inactif</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {mode === 'add' ? 'Ajouter' : 'Modifier'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDialog;

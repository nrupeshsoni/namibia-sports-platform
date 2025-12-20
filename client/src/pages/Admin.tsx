import { useState } from "react";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data - will be replaced with real tRPC queries
const mockFederations = [
  {
    id: 1,
    name: "Athletics Namibia",
    type: "federation",
    contactEmail: "nam@mf.worldathletics.org",
    contactPhone: "0811243550",
    isActive: true,
  },
  {
    id: 2,
    name: "Namibia Football Association",
    type: "federation",
    contactEmail: "csiyauya@nfa.org.na",
    contactPhone: "0811488640",
    isActive: true,
  },
  {
    id: 3,
    name: "Cricket Namibia",
    type: "federation",
    contactEmail: "operations@cricketnamibia.com",
    contactPhone: "+264 85 129 5930",
    isActive: true,
  },
];

export default function Admin() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <h1 className="text-xl font-light tracking-[0.3em]">ADMIN DASHBOARD</h1>
          <Button variant="outline" size="sm">
            Logout
          </Button>
        </div>
      </header>

      <div className="container py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-light tracking-[0.2em] mb-2">FEDERATIONS</h1>
          <p className="text-muted-foreground">
            Manage all sports federations and umbrella bodies
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="p-6 rounded-lg border border-border bg-card">
            <p className="text-sm text-muted-foreground mb-2">Total Federations</p>
            <p className="text-3xl font-light text-primary">57</p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card">
            <p className="text-sm text-muted-foreground mb-2">Umbrella Bodies</p>
            <p className="text-3xl font-light text-primary">8</p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card">
            <p className="text-sm text-muted-foreground mb-2">Total Clubs</p>
            <p className="text-3xl font-light text-primary">500+</p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card">
            <p className="text-sm text-muted-foreground mb-2">Active Athletes</p>
            <p className="text-3xl font-light text-primary">10K+</p>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search federations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="federation">Federations</SelectItem>
              <SelectItem value="umbrella_body">Umbrella Bodies</SelectItem>
              <SelectItem value="ministry">Ministry</SelectItem>
              <SelectItem value="commission">Commission</SelectItem>
            </SelectContent>
          </Select>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Federation
          </Button>
        </div>

        {/* Federations Table */}
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Contact Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockFederations.map((federation) => (
                <TableRow key={federation.id}>
                  <TableCell className="font-medium">{federation.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {federation.type.replace("_", " ").toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {federation.contactEmail}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {federation.contactPhone}
                  </TableCell>
                  <TableCell>
                    {federation.isActive ? (
                      <Badge variant="default" className="bg-green-600">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="text-lg font-light tracking-[0.15em] mb-2">CLUBS</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Manage clubs and teams across all federations
            </p>
            <Button variant="outline" size="sm">
              Manage Clubs
            </Button>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="text-lg font-light tracking-[0.15em] mb-2">EVENTS</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create and manage sports events and competitions
            </p>
            <Button variant="outline" size="sm">
              Manage Events
            </Button>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="text-lg font-light tracking-[0.15em] mb-2">ATHLETES</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Track and manage athlete profiles and performance
            </p>
            <Button variant="outline" size="sm">
              Manage Athletes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

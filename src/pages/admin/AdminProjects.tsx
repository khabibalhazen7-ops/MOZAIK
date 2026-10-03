import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  ExternalLink,
  Star,
  MapPin,
  Calendar,
  Layers,
  Filter
} from 'lucide-react';
import { getProjects, deleteProject } from '../../services/db';
import { Project } from '../../types';

export const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [featuredFilter, setFeaturedFilter] = useState('All');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const categories = [
    'All',
    'Residential',
    'Commercial',
    'Landscape',
    'Hospitality',
    'Architecture',
    'Interior',
    'Exterior',
    'Public Space'
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      console.error("Load projects error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const years = useMemo(() => {
    const list = Array.from(new Set(projects.map((p) => p.year).filter(Boolean)));
    return ['All', ...list.sort().reverse()];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.client && p.client.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.architect && p.architect.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        categoryFilter === 'All' ||
        p.category.toLowerCase() === categoryFilter.toLowerCase();

      const matchesYear =
        yearFilter === 'All' || p.year === yearFilter;

      const matchesFeatured =
        featuredFilter === 'All' ||
        (featuredFilter === 'Featured' ? p.featured : !p.featured);

      return matchesSearch && matchesCat && matchesYear && matchesFeatured;
    });
  }, [projects, searchQuery, categoryFilter, yearFilter, featuredFilter]);

  const handleDelete = async (proj: Project) => {
    const targetId = proj.id || proj.slug;
    if (!targetId) return;

    if (window.confirm(`Are you sure you want to delete this project: "${proj.name}"?`)) {
      setDeletingId(targetId);
      try {
        await deleteProject(targetId, proj);
        await loadData();
      } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete project. Please check permissions.");
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5DFD5]">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C7A6B] font-semibold font-mono">
            ARCHITECTURAL PORTFOLIO
          </span>
          <h1 className="font-serif text-3xl text-[#2C2926] mt-1 font-normal">
            Project Management ({projects.length})
          </h1>
          <p className="text-xs text-[#7B756C] mt-1 font-light">
            Manage completed residential, commercial, and landscape projects showcased in the MOZAIK portfolio.
          </p>
        </div>

        <Link
          to="/admin/projects/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2C2926] text-white hover:bg-[#4A4036] text-xs uppercase tracking-[0.16em] font-semibold transition-all cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Project</span>
        </Link>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 border border-[#E5DFD5] space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7B756C]" />
            <input
              type="text"
              placeholder="Search projects by name, location, architect, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#FBF9F5] border border-[#E5DFD5] text-xs text-[#2C2926] placeholder-[#A0988E] focus:outline-hidden focus:border-[#2C2926]"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-[#8C7A6B] font-mono hidden sm:inline">
              Category:
            </span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#FBF9F5] border border-[#E5DFD5] px-3 py-2 text-xs text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-[#8C7A6B] font-mono hidden sm:inline">
              Year:
            </span>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="bg-[#FBF9F5] border border-[#E5DFD5] px-3 py-2 text-xs text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Featured Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-[#8C7A6B] font-mono hidden sm:inline">
              Type:
            </span>
            <select
              value={featuredFilter}
              onChange={(e) => setFeaturedFilter(e.target.value)}
              className="bg-[#FBF9F5] border border-[#E5DFD5] px-3 py-2 text-xs text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
            >
              <option value="All">All Projects</option>
              <option value="Featured">Featured Only</option>
              <option value="Standard">Standard Only</option>
            </select>
          </div>
        </div>

        <div className="text-[11px] text-[#8C7A6B] font-mono flex items-center justify-between pt-1 border-t border-[#F2EFE9]">
          <span>
            Showing {filteredProjects.length} of {projects.length} projects
          </span>
          {(searchQuery || categoryFilter !== 'All' || yearFilter !== 'All' || featuredFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('All');
                setYearFilter('All');
                setFeaturedFilter('All');
              }}
              className="text-xs text-[#2C2926] hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Projects Table / Cards List */}
      {loading ? (
        <div className="py-20 text-center text-xs text-[#8C7A6B] font-mono">
          Loading projects from Firestore...
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-20 text-center bg-white border border-[#E5DFD5] p-8 space-y-3">
          <p className="font-serif text-lg text-[#2C2926]">No projects yet.</p>
          <p className="text-xs text-[#7B756C]">
            Get started by adding your first architectural natural stone showcase.
          </p>
          <Link
            to="/admin/projects/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2C2926] text-white hover:bg-[#4A4036] text-xs uppercase tracking-[0.16em] font-semibold transition-all mt-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Your First Project</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-[#E5DFD5] overflow-x-auto shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FBF9F5] border-b border-[#E5DFD5] text-[#7B756C] font-mono uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Cover</th>
                <th className="py-3 px-4">Project Name</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Year</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4">Updated</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE6]">
              {filteredProjects.map((p) => {
                const updatedStr = p.updatedAt
                  ? new Date(p.updatedAt).toLocaleDateString()
                  : p.createdAt
                  ? new Date(p.createdAt).toLocaleDateString()
                  : '-';

                return (
                  <tr
                    key={p.id || p.slug}
                    className="hover:bg-[#FBF9F5] transition-colors"
                  >
                    {/* Cover Image */}
                    <td className="py-3 px-4 w-20">
                      <div className="w-16 h-11 bg-[#EFECE6] border border-[#E5DFD5] overflow-hidden">
                        <img
                          src={p.coverImage}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    {/* Project Name */}
                    <td className="py-3 px-4 font-medium text-[#2C2926]">
                      <div className="font-serif text-sm">{p.name}</div>
                      <div className="text-[10px] text-[#8C7A6B] font-mono">
                        /projects/{p.slug}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3 px-4 text-[#7B756C]">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#8C7A6B] shrink-0" />
                        <span>{p.location}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-[#EFECE6] text-[#2C2926] text-[10px] font-mono uppercase tracking-wider">
                        {p.category}
                      </span>
                    </td>

                    {/* Year */}
                    <td className="py-3 px-4 font-mono text-[#7B756C]">
                      {p.year}
                    </td>

                    {/* Featured */}
                    <td className="py-3 px-4">
                      {p.featured ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5">
                          <Star className="w-2.5 h-2.5 fill-amber-700 text-amber-700" />
                          Featured
                        </span>
                      ) : (
                        <span className="text-[#A0988E] text-[10px] font-mono">
                          Standard
                        </span>
                      )}
                    </td>

                    {/* Updated */}
                    <td className="py-3 px-4 text-[10px] font-mono text-[#7B756C]">
                      {updatedStr}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        {/* View Live */}
                        <a
                          href={`/projects/${p.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          title="View Live Page"
                          className="p-1.5 text-[#7B756C] hover:text-[#2C2926] transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>

                        {/* Edit */}
                        <Link
                          to={`/admin/projects/${p.id || p.slug}/edit`}
                          title="Edit Project"
                          className="p-1.5 text-[#2C2926] hover:text-[#8C7A6B] transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(p)}
                          disabled={deletingId === (p.id || p.slug)}
                          title="Delete Project"
                          className="p-1.5 text-red-600 hover:text-red-800 cursor-pointer disabled:opacity-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
